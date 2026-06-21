import { CollectionListNames } from "../config/config";
import { AdminModel } from "../models/adminModel";
import { database } from "../mongodb_connection/connection";
import { createUser } from "../networkConnection/networkConnection";
import { encryptPassword } from "../tools/passwordEncrypter";
import readline from "readline";

// Read input from command line

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  try {
    rl.question("Enter super admin username: ", async (userName: string) => {
      rl.question("Enter super admin email: ", async (userEmail: string) => {
        rl.question(
          "Enter super admin password: ",
          async (password: string) => {
            // Check if admin already exists
            const existingAdmin = await database
              .collection<AdminModel>(
                CollectionListNames.DISTRICT_COMMISSION_ADMIN
              )
              .findOne({ userName });

            if (existingAdmin) {
              console.log("Already Created!");
              rl.close();
              process.exit(0);
            }

            // Hash the password
            const hashedPassword = await encryptPassword(password);

            // Create super admin object
            const newAdmin: AdminModel = {
              userName,
              userEmail,
              password: hashedPassword,
            };

            await createUser(newAdmin.userName, newAdmin.password, "admin");

            // Insert into DB
            const result = await database
              .collection<AdminModel>(
                CollectionListNames.DISTRICT_COMMISSION_ADMIN
              )
              .insertOne(newAdmin);

            console.log(
              "Super admin created successfully! Admin ID:",
              result.insertedId
            );
            rl.close();
            process.exit(0);
          }
        );
      });
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
    rl.close();
    process.exit(1);
  }
}

main();
