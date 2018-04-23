const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-as-promised'));
chai.use(require('chai-http'));
const app = require('../src/index');
const Keys = require('../src/models');

before('clean database', () => {
    return Keys.remove();
});

describe('POST /object', () => {

    it('should throw error for invalid payload', () => {
        return chai.request(app)
            .post("/object")
            .send({ name: '' })
            .then((response) => {
                expect(response.body.status).to.have.property('code');
                expect(response.body.status).to.have.property('message');
                expect(response).to.have.status(400);
                expect(response.body.status).to.deep.equal({
                    code: 400,
                    message: "Bad request"
                });
            })
            .catch((error) => {
                throw error;
            });
    });

    it('POST to /object should return created key value pair with timestamp', () => {
        return chai.request(app)
            .post("/object")
            .send({ name: 'Rayees' })
            .then((response) => {
                expect(response.body).to.have.property('key');
                expect(response.body).to.have.property('value');
                expect(response.body).to.have.property('timestamp');
                expect(response.body.key).to.be.equal('name');
                expect(response.body.value).to.be.equal('Rayees');
                expect(response).to.have.status(201);
                return Keys.findKey('name');
            })
            .then(result => {
                expect(result).to.have.property('value');
                expect(result.value).to.be.equal('Rayees');
            })
            .catch((error) => {
                throw error;
            });
    });

    it('POST to /object with updated payload for key should return updated value', () => {
        return chai.request(app)
            .post("/object")
            .send({ name: 'Ahmad' })
            .then((response) => {
                expect(response.body).to.have.property('key');
                expect(response.body).to.have.property('value');
                expect(response.body).to.have.property('timestamp');
                expect(response.body.key).to.be.equal('name');
                expect(response.body.value).to.be.equal('Ahmad');
                expect(response).to.have.status(201);
                return Keys.findKey('name');
            })
            .then(result => {
                expect(result).to.have.property('value');
                expect(result.value).to.be.equal('Ahmad');
            })
            .catch((error) => {
                throw error;
            });
    });

});

describe('GET /object/:key', () => {

    let name;
    let gender;
    let age;
    let color;

    before('create keys', () => {
        name = Keys.create({ key: 'name', value: 'Rayees' });
        gender = Keys.create({ key: 'gender', value: 'male' });
        age = Keys.create({ key: 'age', value: 27 });
        color = Keys.create({ key: 'color', value: 'white' });
        return Keys.remove()
            .then((result) => {
                return Promise.all([name, gender, age, color]);
            })
            .then((result) => {
                [name, gender, age, color] = result;
            })
            .catch((error) => {
                throw error;
            });
    });

    it('should accept a key and return the latest value for that key', () => {
        return chai.request(app)
            .get("/object/name")
            .then((response) => {
                expect(response.body).to.have.property('value');
                expect(response.body.value).to.be.equal('Rayees');
                expect(response).to.have.status(200);
            })
            .catch((error) => {
                throw error;
            });

    });

    it('should return 404 Not Found for invalid key', () => {
        chai.request(app)
            .get("/object/invalidkey")
            .then((response) => {
                expect(response.body.status).to.have.property('code');
                expect(response.body.status).to.have.property('message');
                expect(response).to.have.status(404);
                expect(response.body.status).to.deep.equal({
                    code: 404,
                    message: "Not found"
                });
            })
            .catch((error) => {
                throw error;
            });
    });

    it('should return 400 for invalid timestamp', () => {
        return chai.request(app)
            .get("/object/name?timestamp=abc")
            .then((response) => {
                expect(response.body.status).to.have.property('code');
                expect(response.body.status).to.have.property('message');
                expect(response).to.have.status(400);
                expect(response.body.status).to.deep.equal({
                    code: 400,
                    message: "Bad request"
                });
            })
            .catch((error) => {
                throw error;
            });
    });

    it('should return 404 for not found timestamp', () => {
        return chai.request(app)
            .get("/object/name?timestamp=232")
            .then((response) => {
                expect(response.body.status).to.have.property('code');
                expect(response.body.status).to.have.property('message');
                expect(response).to.have.status(404);
                expect(response.body.status).to.deep.equal({
                    code: 404,
                    message: "Not found"
                });
            })
            .catch((error) => {
                throw error;
            });
    });


    it('should return value of key for valid timestamp', () => {
        return chai.request(app)
            .get("/object/name?timestamp=" + name.timestamp)
            .then((response) => {
                expect(response.body).to.have.property('value');
                expect(response.body.value).to.be.equal(name.value);
                expect(response).to.have.status(200);
            })
            .catch((error) => {
                throw error;
            });
    });

});