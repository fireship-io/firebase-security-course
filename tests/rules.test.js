
const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { setup, teardown } = require('./helpers');

const mockUser = { 
  uid: 'bob',
}

const mockData = {
  'users/bob': {
    roles: ['admin']
  },
  'posts/abc': {
    content: 'hello world',
    uid: 'alice',
    createdAt: null,
    published: false,
  }
};

describe('Database rules', () => {
    let db;
  
    // Applies only to tests in this describe block
    beforeAll(async () => {
      db = await setup(mockUser, mockData);
    });
  
    afterAll(async () => {
      await teardown();
    });
  
    test('deny when reading an unauthorized collection', async () => {
      const ref = db.collection('secret');

      expect( await assertFails( ref.get() ) );
  
    });

    test('allow admin to read unpublished posts', async () => {
      const ref = db.doc('posts/abc');

      expect( await assertSucceeds( ref.get() ) );
  
    });

    test('allow admin to update posts of other users', async () => {
      const ref = db.doc('posts/abc');

      expect( await assertSucceeds( ref.update({ published: true }) ) );
  
    });
    
  });
