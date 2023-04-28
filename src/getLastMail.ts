import { getContent, getMailList, login } from "./yopmail";

const getLastMail = async (email: string): Promise<string | undefined> => {
  const [page, browser] = await login(email);
  const mails = await getMailList(page);
  const lastMail = mails[0];
  const { id } = lastMail;

  const content = await getContent(page, id);
  browser.close();
  return content;
}

export default getLastMail;
