import { Mail } from "./constant";
import { getMailList, login } from "./yopmail";

const getLastMail = async (email: string): Promise<Mail> => {
  const page = await login(email);
  const mails = await getMailList(page);

  return mails[0];
}

export default getLastMail;
