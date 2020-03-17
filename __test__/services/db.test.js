import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'babel-polyfill';

import mocks from '../__mocks__/database.json';
import * as database from '../../src/services/db';
import mongoose from "mongoose";

describe('Database Service', () => {
    let db;

    beforeAll(async () => {
        mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost/issue-tracker", { useNewUrlParser: true, useUnifiedTopology: true });
        db = mongoose.connection;
    });

    afterAll(async () => {
        await db.close();
    });

    it('Changing issue status', () => {
        const open2pending = database.validStatusChange(mocks.validStatusChange.statusOpen, mocks.validStatusChange.statusPending);
        expect(open2pending).toBe(true);
        const open2close = database.validStatusChange(mocks.validStatusChange.statusOpen, mocks.validStatusChange.statusClose);
        expect(open2close).toBe(false);

        const pending2open = database.validStatusChange(mocks.validStatusChange.statusPending, mocks.validStatusChange.statusOpen);
        expect(pending2open).toBe(false);
        const pending2close = database.validStatusChange(mocks.validStatusChange.statusPending, mocks.validStatusChange.statusClose);
        expect(pending2close).toBe(true);

        const close2open = database.validStatusChange(mocks.validStatusChange.statusClose, mocks.validStatusChange.statusOpen);
        expect(close2open).toBe(false);
        const close2pending = database.validStatusChange(mocks.validStatusChange.statusClose, mocks.validStatusChange.statusPending);
        expect(close2pending).toBe(false);
    });

    it('is record valid', () => {
        const valid = database.isRecordValid(mocks.isRecordValid.valid) && true;
        expect(valid).toBe(true);

        const invalid = database.isRecordValid(mocks.isRecordValid.invalid) || false;
        expect(invalid).toBe(false);
    });

    it('crud service', async () => {
        expect.assertions(11);
        let createdIssue = await database.addRecord(mocks.crud.issue)
            .then(created => {
                expect(created.title).toEqual(mocks.crud.issue.title);
                expect(created.description).toEqual(mocks.crud.issue.description);
                expect(created.status).toEqual(mocks.crud.issue.status);
                return created;
            });

        await database.getRecord(createdIssue.id).then(response => {
            expect(response.title).toEqual(createdIssue.title);
            expect(response.description).toEqual(createdIssue.description);
            expect(response.status).toEqual(createdIssue.status);
        });

        const toUpdate = {
            title: 'updatedtest',
            description: 'updatedtest',
            status: 'pending',
        };

        const updatedIssue = await database.updateRecord(createdIssue.id, toUpdate)
            .then(updated => {
                expect(updated.title).toEqual(mocks.crud.updatedIssue.title);
                expect(updated.description).toEqual(mocks.crud.updatedIssue.description);
                expect(updated.status).toEqual(mocks.crud.updatedIssue.status);
                return updated;
            });

        expect(updatedIssue.id).toEqual(createdIssue.id);

        await database.deleteRecord(updatedIssue.id);
        await database.getRecord(updatedIssue.id).then(response =>  expect(response).toEqual(null));
    });
});
