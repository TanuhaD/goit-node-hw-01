const contactsApi = require("./contacts.js");

const { Command } = require("commander");
const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      try {
        const allContacts = await contactsApi.listContacts();
        console.table(allContacts);
      } catch (error) {
        console.log("\x1B[31mError. Try again.");
      }

      break;

    case "get":
      if (!id) {
        console.log("\x1B[31mError. ID is required.");
      }
      try {
        const contact = await contactsApi.getContactById(id);
        console.log("\x1B[32mOK\x1b[0m");
        console.table(contact);
      } catch (error) {
        console.log("\x1B[31mError. Try again.");
      }
      break;

    case "add":
      if (!name || !email || !phone) {
        console.log("\x1B[31mError! Name, email and phone are required!");
        break;
      }
      try {
        const newContact = await contactsApi.addContact(name, email, phone);
        console.log("\x1B[32mCreated \n\x1b[0m");
        console.table([newContact]);
      } catch (error) {
        console.log("\x1B[31mAn error has occurred! Try again.");
      }
      break;

    case "remove":
      if (!id) {
        console.log("\x1B[31mError. Enter ID!");
        break;
      }
      try {
        const newContactList = await contactsApi.removeContact(id);
        if (!newContactList) {
          console.log(`\x1B[31mError! There is no such contact ${id}!`);
          break;
        }
        console.log("\x1B[32mRemoved. New contacts list:\n\x1b[0m");
        console.table(newContactList);
      } catch (error) {
        console.log("\x1B[31mError! Try again.");
      }
      break;

    default:
      console.warn("\x1B[31mUnknown action type!");
  }
};

invokeAction(argv);
