describe('My First Test', () => {
  it('Visits uworld', () => {
    cy.viewport(2560, 1020)
    cy.visit('https://www.uworld.com/app/index.html#/login/')

    cy.contains('Email').click().type('divyaanilp@gmail.com')
    cy.contains('Password').click().type('WOrePTONeldI')
    cy.get('#login_btn').click()
    cy.get('#BtnLaunch8395936').click()
    cy.contains('Previous Tests').click()
    //cy.get('.ng-tns-c199-164 ng-star-inserted').type('100')
    const totalPages = 15
    const totalRows = 10
    // const totalPages = 2
    // const totalRows = 2
    
    for(let i=0; i < 160;i++){
      const randomPage = Math.floor(Math.random() * (15 - 1 + 1) + 1)
      const randomRow = Math.floor(Math.random() * (10 - 1 + 1) + 1)
    
      for(let paginate=1; paginate < randomPage; paginate++){
        cy.get('.mat-paginator-navigation-next').click()
      }

        cy.xpath(`//*[@id="cdk-drop-list-0"]/tbody/tr[${randomRow}]/td[9]/p[3]/i`).click()
        
        
        cy.xpath(`//*[@id="cdk-drop-list-0"]/tbody/tr[${randomRow}]/td[8]`).then(($span) => {


          // $span is the object that the previous command yielded
       
          const questionCount = $span.text();
          // const questionCount = 2;
       
          cy.get('.review-button').click()
          //cy.contains('Full Screen').click()
          
          cy.get('#questionInformation').invoke('attr', 'style', 'flex-basis: 740px;')
          .should('have.attr', 'style', 'flex-basis: 740px;')
          const randomQuestion = Math.floor(Math.random() * (Number(questionCount) - 1 + 1) + 1)

            cy.xpath(`//*[@id="leftNavigator"]/div/table/tbody/tr[${randomQuestion}]/td/span[2]`).click()
            cy.get('#questionInformation').scrollIntoView().screenshot(`${randomPage}-${randomRow}-${randomQuestion}-question`, {capture:'fullPage'})
            cy.get('.question-content.right-content.split-screen').scrollIntoView().screenshot(`${randomPage}-${randomRow}-${randomQuestion}-explanation`, {capture:'fullPage'})
            
            const explanation = cy.get('.question-content.right-content.split-screen')
            explanation.then( element => {
              if(element[0].scrollHeight > element[0].clientHeight) {
                cy.get('.question-content.right-content.split-screen').scrollTo('bottom', { ensureScrollable: false }).screenshot(`${randomPage}-${randomRow}-${randomQuestion}-explanation1`, {capture:'fullPage'})
              }
            }
            )
          

          cy.visit('https://www.uworld.com/courseapp/usmle/v14/previoustests/8395936')
          
         })
       
      
      
    
  }
  })
})
