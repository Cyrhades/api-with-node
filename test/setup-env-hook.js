before(async () => {
    process.env.NODE_ENV = 'test';
    const app = await import('../index.js');
    
    process.env.URL_TEST_API =  `http://localhost:${process.env.PORT}/api`;
    process.env.API_KEY = 'TH36FYE-04BMA21-PQ2KKW2-KN0RHJ3';
});