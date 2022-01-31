import chai from 'chai';
import chaiHttp  from 'chai-http';
chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication API Key', () => {
    // quand la clef existe
    it('with valid API key', async () => {
        await chai.request(process.env.URL_TEST_API)
            .get('/auth')
            .set('x-api-key', process.env.API_KEY)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });


    // quand la clef n'existe pas
    it('with incorrect API key', async () => {
        await chai.request(process.env.URL_TEST_API)
            .get('/auth')
            // Je remplace le premier caractere de l'API key pour quelle n'existe pas
            .set('x-api-key',  '0'+process.env.API_KEY.slice(1))
            .send()
            .then((res) => {
                expect(res).to.have.status(404);
            });
    });


    // quand la clef n'est pas correcte
    it('with invalid API key', async () => {
        await chai.request(process.env.URL_TEST_API)
            .get('/auth')
            // Je retire le premier caractere de l'API key pour quelle soit incorrecte
            .set('x-api-key', process.env.API_KEY.slice(1))
            .send()
            .then((res) => {
                expect(res).to.have.status(400);
            });
    });
});


describe('Authentication Basic', async () => {
    // sans l'authentification basic
    it('without Basic auth', async () => {
        await chai.request(process.env.URL_TEST_API)
            .get('/auth')
            .send()
            .then((res) => {
                expect(res).to.have.status(400);
            });
    });

    // quand la clef n'existe pas
    it('with incorrect Basic auth', async () => {
        await chai.request(process.env.URL_TEST_API)
            .get('/auth')
            // Je remplace le premier caractere de l'API key pour quelle n'existe pas
            .set('Authorization', 'Basic '+Buffer.from('cyrhades76@gmail.com:azerty').toString('base64'))
            .send()
            .then((res) => {
                expect(res).to.have.status(401);
            });
    });


    // quand la clef n'est pas correcte
    it('with correct Basic auth', async () => {
        await chai.request(process.env.URL_TEST_API)
            .get('/auth')
            // Je retire le premier caractere de l'API key pour quelle soit incorrecte
            .set('Authorization', 'Basic '+Buffer.from('cyrhades76@gmail.com:123456').toString('base64'))
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });
});