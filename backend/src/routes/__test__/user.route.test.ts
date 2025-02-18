import httpStatus from 'http-status';
import databaseOperations from '../../utils/test/db-handler';

import { PersonModel } from '../../models/person.model';
import app from '../../server';
import axios from 'axios';
import 'dotenv/config';

const supertest = require('supertest');

let token: String;

beforeAll(async () => {
    const email = process.env.FIREBASE_TEST_AUTH_EMAIL;
    const password = process.env.FIREBASE_TEST_AUTH_PASS;
    const key = process.env.FIREBASE_TEST_AUTH_KEY;

    let body = {
        "email": email,
        "password": password,
        "returnSecureToken": true
    }
    const response = await axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${key}`, body);
    token = response.data.idToken;

    databaseOperations.connectDatabase()
});
afterEach(async () => databaseOperations.clearDatabase());
afterAll(async () => databaseOperations.closeDatabase());

const user1Data = {
    first_name: 'Bing',
    last_name: 'Bong',
    encounters: [] as any,
    persons: [] as any,
}

const user2Data = {
    last_name: 'Mong',
    encounters: [] as any,
    persons: [] as any
}

const user3Data = {
    first_name: 'Tingy',
    encounters: [] as any,
    persons: [] as any
}

const user4Data = {
    first_name: 'Tingy',
    last_name: 'Tangy',
    encounters: [] as any,
}

const user5Data = {
    first_name: 'Tingy',
    last_name: 'Tangy',
    persons: [] as any,
}

const person1Data: PersonModel = {
    full_name: 'Ray Ping',
    interests: ['video games', 'hockey'],
    organisation: 'helloc',
    time_updated: new Date('2022-01-01'),
    how_we_met: 'Hockey club',
    birthday: new Date('2002-12-12'),
    encounters: [] as any,
    first_met: new Date('2022-01-01'),
    gender: "male",
    image: null as any,
    location: null as any,
    social_media: null as any
};

const person2Data: PersonModel = {
    full_name: 'Adam Bong',
    interests: ['badminton', 'golf'],
    organisation: 'helloc',
    time_updated: new Date('2022-02-23'),
    how_we_met: 'Skype',
    birthday: new Date('2001-07-16'),
    encounters: [] as any,
    first_met: new Date('2022-02-23'),
    gender: "other",
    image: null as any,
    location: null as any,
    social_media: null as any
}

describe('POST /users', () => {
    it('Successfully creates a new user with all user info given', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .set('Authorization', token)
            .expect(httpStatus.CREATED)
    })

    it('User without persons field can be created and defaults to empty array', async () => {
        const { body: user } = await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user4Data)
            .set('Authorization', token)
            .expect(httpStatus.CREATED)

        expect(user.persons).toEqual([]);
    })

    it('User without encounters field can be created and defaults to empty array', async () => {
        const { body: user } = await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user5Data)
            .set('Authorization', token)
            .expect(httpStatus.CREATED)

        expect(user.encounters).toEqual([]);
    })

    it('Successful user creation returns correct user info without auth_id', async () => {
        const { body: user } = await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .set('Authorization', token);

        expect(user.auth_id).toBeUndefined();
        expect(user.first_name).toEqual(user1Data.first_name);
        expect(user.last_name).toEqual(user1Data.last_name);
        expect(user.encounters).toEqual(user1Data.encounters);
        expect(user.persons).toEqual(user1Data.persons);
    })

    it('Failed to create new user without auth token', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .expect(httpStatus.UNAUTHORIZED);
    })

    it('Failed to create new user without first name', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user2Data)
            .set('Authorization', token)
            .expect(httpStatus.BAD_REQUEST)
    })

    it('Failed to create new user without last name', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user3Data)
            .set('Authorization', token)
            .expect(httpStatus.BAD_REQUEST)
    })

    it('User not stored in database when request is unsuccessful', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data);

        const { body: user } = await supertest(app).get('/api/users')
            .set('Authorization', token)
            .expect(httpStatus.OK);        
        
        expect(user).toBeFalsy();
    })

    it('User with same UID and info cannot be created twice', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .set('Authorization', token)
            .expect(httpStatus.CREATED)

        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .set('Authorization', token)
            .expect(httpStatus.CONFLICT);

        await supertest(app).get('/api/users')
            .set('Authorization', token)
            .expect(httpStatus.OK);
    })

    it('User with same UID but different info cannot be created twice', async () => {
        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user1Data)
            .set('Authorization', token)
            .expect(httpStatus.CREATED)

        await supertest(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(user2Data)
            .set('Authorization', token)
            .expect(httpStatus.CONFLICT);

        await supertest(app).get('/api/users')
            .set('Authorization', token)
            .expect(httpStatus.OK);
    })
})
