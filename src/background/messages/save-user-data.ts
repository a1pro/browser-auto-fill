import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"
import type { PlasmoMessaging } from "@plasmohq/messaging"

const storage     = new SecureStorage();
const PASSWORD    = "ZcerumvGGnkqumZCNKllFMUQxK"
const STORAGE_KEY = "mystic_data"

// function to store user fields data into storage
async function storeData(data) {
  const storage = new SecureStorage() //{ area: "local" }
  await storage.clear()

  // Must set password then watch, otherwise the namespace key will mismatch
  await storage.setPassword(PASSWORD)

  // set the data into storage
  await storage.set(STORAGE_KEY, data)
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let [dobYearInput, dobMonthInput, dobDayInput] = (req.body.date_of_birth!== "")?req.body.date_of_birth.split("-"):["","",""];
  req.body["dob_day"]   = parseInt(dobDayInput);
  req.body["dob_month"] = parseInt(dobMonthInput);
  req.body["dob_year"]  = parseInt(dobYearInput);
  
  await storeData(req.body)
  res.send({success:true,message:"Data saved successfully."})
}

export default handler