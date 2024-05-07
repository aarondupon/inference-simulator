describe('ProjectsPage', () => {
  beforeEach(() => {
    cy.visit('/projects'); // replace with the actual route to your ProjectsPage
  });

  it('displays projects', () => {
    cy.get('.my-card').should('exist'); // checks if the project cards exist
  });

  it('opens the create project dialog when the create button is clicked', () => {
    cy.get('button.btn-new-project').click();
    cy.get('.q-dialog').should('exist');
    cy.get('.q-dialog').should('contain', 'Create Project');
    cy.get('.q-dialog').should('contain', 'Name');
    cy.get('.q-dialog').should('contain', 'Save');
    cy.get('.q-dialog').should('contain', 'Cancel');

    cy.get('.q-dialog')
      .find('button:contains("Cancel")')
      .first()
      .closest('button')
      .click();
  });

  it('should handle promise rejection', () => {
    cy.get('button.btn-new-project').click();
    cy.get('.q-dialog').should('exist');
    cy.get('.q-dialog').should('contain', 'Create Project');
    cy.get('.q-dialog').should('contain', 'Name');
    cy.get('.q-dialog').should('contain', 'Save');
    cy.get('.q-dialog').should('contain', 'Cancel');
    cy.on('uncaught:exception', (err) => {
      expect(err.message).to.include('Name is required');
      return false; // returning false prevents Cypress from failing the test
    });
    cy.get('.q-dialog')
      .find('button:contains("Save")')
      .first()
      .closest('button')
      .click();
  });

  const generateRandomName = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const projects = ['Test' + generateRandomName()];
  it('opens the create project dialog when the create button is clicked', () => {
    projects.forEach((name) => {
      cy.get('button.btn-new-project').click();
      cy.get('.q-dialog').should('exist');
      cy.get('.q-dialog').find('input').type(`${name}`);
      cy.get('.q-dialog')
        .wait(1000)
        .find('button:contains("Save")')
        .first()
        .closest('button')
        .click();
      cy.get('.q-dialog').should('exist');
      cy.get('.q-dialog').should('contain', 'Create Project');
      cy.get('.q-dialog').should('contain', 'Name');
      cy.get('.q-dialog').should('contain', 'Save');
      cy.get('.q-dialog').should('contain', 'Cancel');
    });
  });

  it('opens the project detail page when a project card is clicked', () => {
    cy.intercept('GET', '/api/projects').as('getEndpoint');
    cy.visit('/projects');
    cy.wait('@getEndpoint');
    cy.get('.my-card').first().click();
    cy.url().should('include', '/projects/');
  });

  it('capture frames', () => {
    cy.intercept('GET', '/api/projects').as('getEndpoint');
    cy.intercept('POST', '/api/upload/*').as('uploadProject');
    cy.visit('/?#/projects/1');
    cy.wait('@getEndpoint');
    cy.get('button:contains("Capture Frame")').click();
    cy.get('button:contains("Capture Frame")').click();
    cy.wait('@uploadProject');
    cy.get('button:contains("Stop")').click();

    cy.get('.frame').should('have.length', 2);

    cy.url().should('include', '/projects/');
  });

  it('add and remove tags from selected frame', () => {
    cy.intercept('GET', '/api/projects').as('getEndpoint');
    cy.intercept('POST', '/api/upload/*').as('uploadProject');
    cy.intercept('POST', '/api/tag/*').as('updateTags');

    cy.visit('/?#/projects/1');
    cy.wait('@getEndpoint');
    cy.get('button:contains("Capture Frame")').click();
    cy.get('button:contains("Capture Frame")').click();
    cy.wait('@uploadProject');
    cy.get('button:contains("Stop")').click();

    cy.wait(100).get('.frame__image').first().click();
    cy.get('button:contains("Edit tags")').click();
    cy.get('.input-tag').type('new tag');
    cy.get('.input-tag').type('{enter}');

    // verify tags
    cy.get('.q-chip').should('contain', 'new tag');
    // check remove
    cy.get('.q-chip:contains("new tag")').find('.q-chip__icon--remove').click();
  });

  it('removes a project when delete button is clicked', () => {
    cy.intercept('GET', '/api/projects').as('getEndpoint');
    cy.intercept('DELETE', '/api/project/*').as('deleteProject');
    cy.visit('/projects');

    cy.wait('@getEndpoint');
    const card = cy.get(`.my-card:contains("${projects[0]}")`);
    card
      .find('button.q-btn i:contains("delete")')
      .first()
      .closest('button')
      .click();
    cy.wait('@deleteProject');
    cy.get('.my-card').should('not.contain', card);
  });
});

export {};
