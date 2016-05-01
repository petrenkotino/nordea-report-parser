import parser from '../../../lib/parser/parser';

describe('test/parser/unit/parser-test.js', () => {
    describe('toJson', () => {
        describe('with valid input', () => {
            let csv_string;
            let expected;

            beforeEach(() => {
                csv_string = ['Datum,Transaktion,Kategori,Belopp,Saldo',
                    '2015-01-30,Kortköp 1234 GREAT SUSHI,,"-95,00","65.808,97"',
                    '2015-01-30,Kortköp 4321 SPORTSSHOP,,"-2.316,21","65.903,97"',
                ].join('\n');
            });

            beforeEach(() => {
                expected = [
                    {
                        amount: -95,
                        balance: 65.808,
                        category: undefined,
                        date: new Date('2015-01-30T00:00:00.000Z'),
                        transaction: 'Kortköp 1234 GREAT SUSHI',
                    },
                    {
                        amount: -2.316,
                        balance: 65.903,
                        category: undefined,
                        date: new Date('2015-01-30T00:00:00.000Z'),
                        transaction: 'Kortköp 4321 SPORTSSHOP',
                    },
                ];
            });

            it('should resolve with the expected array of json objects', () => {
                return parser.toJson(csv_string).should.be.fulfilledWith(expected);
            });
        });

        describe('with invalid csv input', () => {
            let csv_string;

            beforeEach(() => {
                csv_string = ['atum,Weird',
                    '2015-01-30,0',
                    '2015-01-30,97',
                ].join('\n');
            });

            it('should be rejected', () => {
                return parser.toJson(csv_string).should.be.rejected();
            });
        });
    });
});
