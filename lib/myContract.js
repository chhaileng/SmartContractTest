/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

let Car = require('./Car.js');

class MyContract extends Contract {

    async init(ctx) {
        let car1 = await new Car('CAR1', 'Lexus', 'white', '9e95ba27836257bdcb5b001de8f650b6', 'Kok Dara');
        let car2 = await new Car('CAR2', 'Ford', 'white', '8862ca684751f4e83d5fbfc728bbd8b4', 'Kok Sva');
        let car3 = await new Car('CAR3', 'Toyota', 'white', '5a888c6121932f8a0822424e034d4628', 'Kok Kdam');
        let car4 = await new Car('CAR4', 'Rang Rover', 'white', 'f786d8f1624dc424b538209d268dfcfa', 'Kok Jma');
        let car5 = await new Car('CAR5', 'Pruis', 'white', 'c749ef37a3a388d67b79d2029daeaa7b', 'Kok Bopha');

        await ctx.stub.putState(car1.carId, Buffer.from(JSON.stringify(car1)));
        await ctx.stub.putState(car2.carId, Buffer.from(JSON.stringify(car2)));
        await ctx.stub.putState(car3.carId, Buffer.from(JSON.stringify(car3)));
        await ctx.stub.putState(car4.carId, Buffer.from(JSON.stringify(car4)));
        await ctx.stub.putState(car5.carId, Buffer.from(JSON.stringify(car5)));
    }

    // async initLedger(ctx) {
    //     console.info('============= START : Initialize Ledger ===========');
    //     const cars = [
    //         {
    //             color: 'blue',
    //             make: 'Enoy',
    //             model: 'Enoy',
    //             owner: 'Kok Sva',
    //         },
    //         {
    //             color: 'red',
    //             make: 'Ford',
    //             model: 'Mustang',
    //             owner: 'Brad',
    //         },
    //         {
    //             color: 'green',
    //             make: 'Hyundai',
    //             model: 'Tucson',
    //             owner: 'Jin Soo',
    //         },
    //         {
    //             color: 'yellow',
    //             make: 'Volkswagen',
    //             model: 'Passat',
    //             owner: 'Max',
    //         }
    //     ];

    //     for (let i = 0; i < cars.length; i++) {
    //         cars[i].docType = 'car';
    //         await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
    //         console.info('Added <--> ', cars[i]);
    //     }
    //     console.info('============= END : Initialize Ledger ===========');
    // }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

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
