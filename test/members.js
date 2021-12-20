const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

chai.should();
chai.use(chaiHttp);
let tokenAdmin;

const userAdmin = {
  email: 'agustin_tafura@test.com',
  password: '123456'
};

before((done) => {
  chai.request(app)
    .post('/auth/login')
    .send(userAdmin)
    .end((err, res) => {
      res.should.have.status(200);
      tokenAdmin = res.body.token;
      done();
    });
});

describe('GET /members', () => {
  it('it should get all members data', (done) => {
    chai.request(app)
      .get('/members')
      .set({ Authorization: `Bearer ${tokenAdmin}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('countMembers');
        res.body.should.have.property('lastPage');
        res.body.should.have.property('previousPage');
        res.body.should.have.property('nextPage');
        res.body.should.have.property('data');
        done();
      });
  });
  describe('GET /member should not be found', () => {
    it('Page not found', (done) => {
      chai.request(app)
        .get('/member')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
  describe('GET /members?page=h', () => {
    it('The page parameter must be a number.', (done) => {
      chai.request(app)
        .get('/member?page=h')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });
  describe('GET /members?page=" "', () => {
    it('Should take you to page 1', (done) => {
      chai.request(app)
        .get('/members?page=')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });
  describe('GET /categories?page=-5', () => {
    it('The page must be greater than one.', (done) => {
      chai.request(app)
        .get('/members?page=-5')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .end((err, response) => {
          response.should.have.status(500);
          done();
        });
    });
  });
  describe('GET /members?page=300', () => {
    it('The requested page is greater than the last page.', (done) => {
      chai.request(app)
        .get('/members?page=300')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .end((err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });

  describe('UPDATE the name of member with ID = 2', () => {
    it('Should update the name of member', (done) => {
      chai.request(app)
        .put('/members/2')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .send({
          name: 'UpdateMember',
          id: 2
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('Insert a new Member', () => {
    it('Create a member', (done) => {
      chai.request(app)
        .post('/members')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .send({
          name: 'NewMember',
          description: 'description',
          image: 'aimage',
          facebookUrl: 'aurl',
          instagramUrl: 'aurl',
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Delete a member with id = 1', () => {
    it('Delete the member with id = 1', (done) => {
      chai.request(app)
        .delete('/members/1')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });
  describe('Dont delete a member', () => {
    it('Dont delete a member that doesnt exist', (done) => {
      chai.request(app)
        .delete('/members/448')
        .set({ Authorization: `Bearer ${tokenAdmin}` })
        .end((err, response) => {
          response.should.have.status(400);
          done();
        });
    });
  });
});
