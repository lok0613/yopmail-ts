import { Mail } from "./constant";
import { getContent, getMailList, login } from "./yopmail";

const getLastMail = async (email: string): Promise<string | undefined> => {
  const page = await login(email);
  const mails = await getMailList(page);
  const lastMail = mails[0];
  const { id } = lastMail;

  return await getContent(page, id);
}

export default getLastMail;
