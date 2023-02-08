/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('payments', tbl => {
    tbl.uuid('id').primary()
    tbl.string('name').notNullable()
    tbl.string('email').notNullable()
    tbl.string('currency').notNullable()
    tbl.float('amount').notNullable()
    tbl.string('city').notNullable()
    tbl.string('country').notNullable()
    tbl.string('stripeId').notNullable()
    tbl.boolean('success').defaultTo(false)
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payments');
};
