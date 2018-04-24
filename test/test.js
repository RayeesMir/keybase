const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-as-promised'));
chai.use(require('chai-http'));
const app = require('../src/index');
const Keys = require('../src/models');

before('clean database', () => {
    return Keys.remove();
});

describe('Create Get and Update Keys, Sequecially', () => {

    it('Should create,get and update key ', () => {
        return Keys.create({ key: 'country', value: 'Singapore' })
            .then((result) => {
                expect(result).to.have.property('value');
                expect(result).to.have.property('key');
                expect(result).to.have.property('timestamp');
                expect(result.key).to.be.equal('country');
                expect(result.value).to.be.equal('Singapore');
                return chai.request(app).get("/object/" + result.key + "?timestamp=" + (result.timestamp - 1));
            })
            .then((response) => {
                expect(response.body.status).to.have.property('code');
                expect(response.body.status).to.have.property('message');
                expect(response.body.status.code).to.be.equal(404);
                expect(response).to.have.status(404);
                return Keys.create({ key: 'country', value: 'Thailand' });
            })
            .then((result) => {
                expect(result).to.have.property('value');
                expect(result).to.have.property('key');
                expect(result).to.have.property('timestamp');
                expect(result.key).to.be.equal('country');
                expect(result.value).to.be.equal('Thailand');
                return chai.request(app).get("/object/" + result.key + "?timestamp=" + (result.timestamp - 1));
            })
            .then((result) => {
                expect(result.body).to.have.property('value');
                expect(result.body.value).to.be.equal('Singapore');
            })
            .catch((error) => {
                throw error;
            });
    });
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
    before('create keys', () => {
        return Keys.remove()
            .then((result) => {
                return Keys.create({ key: 'name', value: 'Rayees' });
            })
            .then((result) => {
                name = result;
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