describe('Notebook test', () => {
  it('Visits uworld', () => {
    cy.viewport(2560, 1020)
    cy.visit('https://www.uworld.com/app/index.html#/login/')

    cy.contains('Email').click().type('divyaanilp@gmail.com')
    cy.contains('Password').click().type('WOrePTONeldI')
    cy.get('#login_btn').click()
    cy.get('#BtnLaunch8395936').click()
    cy.contains('My Notebook').click()
    
    for(let page = 161;page<=218;page++) {
      cy.xpath(`/html/body/app-root/app-mainlayout/div/div[2]/notebook/courseapp-uworld-notebook/uworld-notebook/div/mat-drawer-container/mat-drawer/div/div/div[1]/div[3]/div/div/div/div/div[2]/div[${page}]/div/div/div/div/span/span`).then(link => {
        link.click()
        cy.wait(1000);
        cy.screenshot(`notebook-${page}`, {capture:'fullPage'})
              
        const explanation = cy.xpath('//*[@id="notebooktext"]')
        explanation.then( element => {
          if(element[0].scrollHeight > element[0].clientHeight) {
            cy.xpath('//*[@id="notebooktext"]').scrollTo('bottom', { ensureScrollable: false }).screenshot(`notebook-${page}-more`, {capture:'fullPage'})
          }
        }
        )
      })
      
    }
    
  })
})
