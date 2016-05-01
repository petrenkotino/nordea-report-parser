import csv_parse from 'csv-parse';
import hoek from 'hoek';
import { joi, validate } from '../validator/validator';
import logger from '../logger';

const expected_result_schema = joi.object().required().keys({
    amount: joi.string().required(),
    date: joi.date().required(),
    category: joi.string().optional(),
    balance: joi.string().required(),
    transaction: joi.string().required(),
});

const expense_report_transformation_schema = {
    amount: 'Belopp',
    date: 'Datum',
    category: 'Kategory',
    balance: 'Saldo',
    transaction: 'Transaktion',
};

function transform(json) {
    const transformed_json = hoek.transform(json, expense_report_transformation_schema);
    const result = [];
    for (const report_entry of transformed_json) {
        let valid_entry;
        try {
            valid_entry = validate(report_entry, expected_result_schema);
            valid_entry.amount = parseFloat(valid_entry.amount);
            valid_entry.balance = parseFloat(valid_entry.balance);
        }
        catch (err) {
            err.payload = { transformed_object: report_entry };
            logger.error(err, 'invalid transformed object');
            throw err;
        }
        result.push(valid_entry);
    }
    return result;
}

const api = {
    toJson(csv_string) {
        return new Promise((resolve, reject) => {
            csv_parse(csv_string, { columns: true }, (err, data) => {
                if (err) {
                    logger.error(err, 'failed parsing csv');
                    reject(err);
                    return;
                }
                try {
                    const transformed_result = transform(data);
                    resolve(transformed_result);
                    return;
                }
                catch (transform_err) {
                    logger.info(err, 'failed transforming json');
                    reject(transform_err);
                    return;
                }
            });
        });
    },
};

export default api;
