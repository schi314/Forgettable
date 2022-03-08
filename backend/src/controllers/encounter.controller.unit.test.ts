import request from "supertest";
import app from '..';
import { encounterService } from '../services/index';

jest.mock("../services/index");

describe('Creating encounters', () => {
    it.only('Should create an encounter successfully', (done) => {
        encounterService.createEncounter.mockResolvedValue();

        request(app)
            .post("/api/encounters/create")
            .send({date: '9/03/2022', description: "bleh", location: "here", persons: []})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                return done();
            })
    })

    it.only('Should fail to create an encounter', (done) => {
        encounterService.createEncounter.mockImplementation(() => {
            throw new Error();
        })

        request(app)
            .post("/api/encounters/create")
            .send({date: '9/03/2022', description: "bleh", location: "here"})
            .set('Accept', 'application/json')
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                return done();
            })
    })
})