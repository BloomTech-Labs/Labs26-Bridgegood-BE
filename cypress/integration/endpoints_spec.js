describe('Home Endpoint', () => {
    it('GET / - Returns a server status.', () => {
        cy.request('GET', 'http://localhost:8000/').then(resp => {
            expect(resp).to.have.property('status', 200)
            expect(resp.body).to.have.all.keys('api', 'timestamp')
        })
    })
})