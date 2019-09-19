/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

let Car = require('./Car.js');

class MyContract extends Contract {

    async init(ctx) {
        let car1 = await new Car('CAR1', 'Lexus',      'white',  'Phnom Penh 2A-1363',  'Kok Dara');
        let car2 = await new Car('CAR2', 'Ford',       'black',  'Kandal 2AB-1231',     'Kok Sva');
        let car3 = await new Car('CAR3', 'Toyota',     'silver', 'Phnom Penh 2AQ-3246', 'Kok Kdam');
        let car4 = await new Car('CAR4', 'Rang Rover', 'blue',   'Phnom Penh 2N-3987',  'Kok Jma');
        let car5 = await new Car('CAR5', 'Pruis',      'white',  'Kampot 2Y-2294',      'Kok Bopha');

        await ctx.stub.putState(car1.carId, Buffer.from(JSON.stringify(car1)));
        await ctx.stub.putState(car2.carId, Buffer.from(JSON.stringify(car2)));
        await ctx.stub.putState(car3.carId, Buffer.from(JSON.stringify(car3)));
        await ctx.stub.putState(car4.carId, Buffer.from(JSON.stringify(car4)));
        await ctx.stub.putState(car5.carId, Buffer.from(JSON.stringify(car5)));
    }






    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    // async createCar(ctx, carNumber, make, model, color, owner) {
    //     console.info('============= START : Create Car ===========');

    //     const car = {
    //         color,
    //         docType: 'car',
    //         make,
    //         model,
    //         owner,
    //     };

    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : Create Car ===========');
    // }

    // async createCar(ctx, model, color, plateNumber, owner) {
    //     let allCars = await this.queryWithQueryString(ctx, JSON.stringify({ selector: { } }));
    //     let count = JSON.parse(allCars).length;

    //     let car = await new Car('CAR' + (count + 1), model, color, plateNumber, owner);

    //     let response = await ctx.stub.putState(car.carId, Buffer.from(JSON.stringify(car)));

    //     return JSON.stringify(response);
    // }

    async createCar(ctx, args) {
        args = JSON.parse(args);

        let allCars = await this.queryWithQueryString(ctx, JSON.stringify({ selector: { } }));
        let count = JSON.parse(allCars).length;

        let car = await new Car('CAR' + (count + 1), args.model, args.color, args.plateNumber, args.owner);

        let response = await ctx.stub.putState(car.carId, Buffer.from(JSON.stringify(car)));

        return JSON.stringify(response);
    }

    async queryAllCars(ctx) {
        let queryString = { selector: {} };
        
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    async countAll(ctx) {
        let queryString = { selector: {} };
        
        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResults).length;
    }

    async queryByColor(ctx, carColor) {
        let queryString = {
            selector: {
                color: carColor
            }
        };

        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;
    }

    async queryWithQueryString(ctx, queryString) {
        let resultIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];

        while (true) {
            let res = await resultIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }

            if (res.done) {
                await resultIterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    // async queryAllCars(ctx) {
    //     const startKey = 'CAR0';
    //     const endKey = 'CAR999';

    //     const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    //     const allResults = [];
    //     while (true) {
    //         const res = await iterator.next();

    //         if (res.value && res.value.value.toString()) {
    //             console.log(res.value.value.toString('utf8'));

    //             const Key = res.value.key;
    //             let Record;
    //             try {
    //                 Record = JSON.parse(res.value.value.toString('utf8'));
    //             } catch (err) {
    //                 console.log(err);
    //                 Record = res.value.value.toString('utf8');
    //             }
    //             allResults.push({ Key, Record });
    //         }
    //         if (res.done) {
    //             console.log('end of data');
    //             await iterator.close();
    //             console.info(allResults);
    //             return JSON.stringify(allResults);
    //         }
    //     }
    // }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = MyContract; 