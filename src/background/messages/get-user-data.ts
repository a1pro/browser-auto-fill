import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"
import type { PlasmoMessaging } from "@plasmohq/messaging"

const storage     = new SecureStorage();
const PASSWORD    = "ZcerumvGGnkqumZCNKllFMUQxK"
const STORAGE_KEY = "mystic_data"

// function to get user fields data from storage
async function getData() {
  const storage = new SecureStorage() //{ area: "local" }

  // Must set password then watch, otherwise the namespace key will mismatch
  await storage.setPassword(PASSWORD)

  // set the data into storage
  let userData = await storage.get(STORAGE_KEY)
  userData = (userData !== undefined)?userData:{title: "",first_name: "",last_name: "",gender: "",country: "",dob_day:"",dob_month:"",dob_year:"",date_of_birth:""}
  return userData

}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  let data = await getData()
  res.send({success:true,message:"Data fetched successfully.", data:data})
}

export default handler