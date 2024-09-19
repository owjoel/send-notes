const sinon = require('sinon');
const { describe, beforeEach, afterEach, test, expect } = require('@jest/globals');
const RequestItem = require('../models/requestItem');
const { createRequest, findById } = require('../services/requestItemService');

describe('createRequest', () => {
    let saveStub;

    beforeEach(() => {
        saveStub = sinon.stub(RequestItem.prototype, 'save');
    });

    afterEach(() => {
        saveStub.restore();
    });

    test('should save the request and return it', async () => {
        const user = 'user123';
        const requestData = { tag: 'valid_tag' };

        saveStub.resolves(); // Mock the save method to resolve successfully

        const result = await createRequest(user, requestData);

        expect(result).toBeInstanceOf(RequestItem);
        expect(result.userId).toBe(user);
        expect(result.tag).toBe(requestData.tag);
    });

    test('should throw validation error if tag is invalid', async () => {
        const user = 'user123';
        const requestData = { tag: 'bad boy :( !' };

        await expect(createRequest(user, requestData)).rejects.toThrow('validation error request tag');
    });

    test('should throw internal server error if save fails', async () => {
        const user = 'user123';
        const requestData = { tag: 'valid_tag' };

        saveStub.rejects(new Error('save error')); // Mock the save method to reject with an error

        await expect(createRequest(user, requestData)).rejects.toThrow('internal server error');
    });

});