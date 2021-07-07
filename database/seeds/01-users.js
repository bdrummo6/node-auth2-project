// pre-hashed password for "abc12345"
const hashedPassword = "$2a$14$qHqCbXUImiBOgXlFNX47wuA7uFWNGNAZutYLvOeye9eotewGlfYV6";

exports.seed = async function(knex) {
   await knex('users').insert([
      { username: "user-1", password: hashedPassword, department: "admin" },
      { username: "user-2", password: hashedPassword, department: "sales" },
   ])
}

