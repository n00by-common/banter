const Logger = require('./logger');

class BanterGuild {
    constructor(bot, id) {
        this.id = id;
        this.db = bot.db;
        this._temp_storage = new Map();
    }

    db_get(field) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT ${field} FROM servers WHERE id = ?`, this.id, (err, row) => {
                if (err)
                    reject(err);
                else if (!row || row[field] === undefined)
                    reject('null row or undefined field');
                else
                    resolve(row[field]);
            });
        });
    }

    db_set(field, value) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE servers SET ${field} = ? WHERE id = ?`, value, this.id, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });
        });
    }

    db_reset() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('DELETE FROM servers WHERE id = ?', this.id, (err) => {
                    if (err)
                        reject(err);
                });

                this.db.run('INSERT INTO servers (id) VALUES (?)', this.id, (err) => {
                    if (err)
                        reject(err);

                    resolve(true);
                });
            });
        });
    }

    temp_storage() {
        return this._temp_storage;
    }

    async get_auto_roles() {
        const db_response = await this.db_get('autoroles').catch(Logger.error);
        return db_response ? db_response.split(',') : [];
    }

    async remove_auto_role(role) {
        const autoroles = await this.get_auto_roles();
        const i = autoroles.indexOf(role);

        if (i > -1) {
            autoroles.splice(i, 1);
            return this.db_set('autoroles', autoroles.join(','));
        } else
            return false;

    }

    async add_auto_role(role) {
        const autoroles = await this.get_auto_roles();
        const i = autoroles.indexOf(role);

        if (i < 0) {
            autoroles.push(role);
            return this.db_set('autoroles', autoroles.join(','));
        } else
            return false;
    }
}

module.exports = BanterGuild;