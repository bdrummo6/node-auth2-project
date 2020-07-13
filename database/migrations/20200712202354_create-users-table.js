

exports.up = async function(knex) {
	await knex.schema.createTable('users', tbl => {
		tbl.increments();
		tbl.string('username', 128).notNullable().unique();
		tbl.string('password', 256).notNullable();
		tbl.string('department', 128).notNullable();
	})
}

exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('users');
}