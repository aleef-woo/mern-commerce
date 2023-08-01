import bcrypt from "bcryptjs";

const users = [
  {
    name: "Edith Gutierrez",
    email: "meccoobo@gicjobi.sx",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Justin Steele",
    email: "hel@rafjo.nf",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Sadie Underwood",
    email: "oru@beh.wf",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

export default users;
