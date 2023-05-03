import * as puppeteer from 'puppeteer';
import { yopmailUrl, Mail } from './constant';

const login = async (email: string): Promise<[puppeteer.Page, puppeteer.Browser]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(yopmailUrl);
  await page.type('#login', email);
  await page.click('div#refreshbut > button.md');
  try {
    await page.waitForNavigation();
  } catch (e) {
    // in case it times out
    await page.screenshot({path: "/tmp/yopamil-timeout.jpg"});
  }

  return [page, browser];
}

const getLeftFrame = async (page: puppeteer.Page): Promise<puppeteer.Frame> => {
  const frameHandle = await page.waitForSelector('iframe#ifinbox');
  const frame = await frameHandle?.contentFrame();
  if (!frame) {
    throw new Error("Left frame is not existed.")
  }

  return frame;
}

const getMailList = async (page: puppeteer.Page, pageNo: number = 1): Promise<Mail[]> => {
  const leftFrame = await getLeftFrame(page);
  const ids = await leftFrame?.$$eval(
    'div.mctn > div.m',
    (items: HTMLElement[]) => items.map((item: HTMLElement) => item.getAttribute('id'))
  );
  const senders = await leftFrame?.$$eval(
    'div.mctn > div.m span.lmf',
    (items: HTMLElement[]) => items.map((item: HTMLElement) => item.textContent)
  );
  const titles = await leftFrame?.$$eval(
    'div.mctn > div.m div.lms',
    (items: HTMLElement[]) => items.map((item: HTMLElement) => item.textContent)
  );

  if (!ids || !senders || !titles) {
    return [];
  }

  return [...Array(ids.length - 1).keys()].map((t: number) => {
    return {
    id: ids[t],
    sender: senders[t],
    title: titles[t]
    } as Mail
  })
}

const getContent = async (page: puppeteer.Page, id: string): Promise<string> => {
  const leftFrame = await getLeftFrame(page);
  const rightFrame = await getRightFrame(page);

  const mailSelector = `div.mctn > div.m[id="${id}"]`;
  const currentId = await leftFrame.$eval("div[currentmail]", (pile: HTMLElement) => pile.getAttribute("id"));
  console.log("currentmail", currentId);
  if (id !== currentId) {
    await leftFrame.click(mailSelector)
    await rightFrame.waitForNavigation();
  }
  
  return await rightFrame.content();
};

const getRightFrame = async (page: puppeteer.Page): Promise<puppeteer.Frame> => {
  const frameHandle = await page.$('iframe#ifmail');
  const frame = await frameHandle?.contentFrame();
  if (!frame) {
    throw new Error("Right frame is not existed.");
  }

  return frame;
}

export {
  login,
  getLeftFrame,
  getRightFrame,
  getMailList,
  getContent,
}
