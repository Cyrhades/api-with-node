before(async function() {
    process.env.NODE_ENV = 'test';
    const app = (await import('../index.js')).default;
    process.env.URL_TEST_API =  `http://localhost:${process.env.PORT}/api`;
    
    it('Démarrage du Serveur Http', async function() {
        // Ajout de la création de fixtures users
        const userFixtures = (await import('./fixtures/users.js')).default;
        // on vide la collection et on crée 20 users
        await userFixtures.empty().create(20); 

        // Ajout de la création de fixtures contacts
        const contactsFixtures = (await import('./fixtures/contacts.js')).default;
        // on vide la collection et on crée 20 contacts
        await contactsFixtures.empty().create(20); 
    });
});