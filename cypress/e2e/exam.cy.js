describe('My = 1  Test', () => {
  it('Visits uworld', () => {
    cy.viewport(2560, 1020)
    cy.visit('https://www.uworld.com/app/index.html#/login/')

    cy.contains('Email').click().type('divyaanilp@gmail.com')
    cy.contains('Password').click().type('WOrePTONeldI')
    cy.get('#login_btn').click()
    cy.get('#BtnLaunch8395935').click()
    
    //cy.get('.ng-tns-c199-164 ng-star-inserted').type('100')
    
    const totalRows = 4
    
      for(let row =1; row<=totalRows;row++){
        
        cy.xpath(`/html/body/app-root/app-mainlayout/div/div[2]/usmle-blocks/div/table/tbody/tr[${row}]/td[5]/span[3]`).click()
                
          // $span is the object that the previous command yielded
       
          // const questionCount = 2;
       
          cy.get('.review-button').click()
          //cy.contains('Full Screen').click()
          
          cy.get('#questionInformation').invoke('attr', 'style', 'flex-basis: 740px;')
          .should('have.attr', 'style', 'flex-basis: 740px;')

          for(let question=1;question <= 40; question++){
            cy.xpath(`//*[@id="leftNavigator"]/div/table/tbody/tr[${question}]/td/span[2]`).click()
            cy.screenshot(`exam-${row}-${question}-question`, {capture:'fullPage'})
            //cy.get('.question-content.right-content.split-screen').scrollIntoView().screenshot(`${page}-${row}-${question}-explanation`, {capture:'fullPage'})
            const explanation = cy.get('.question-content.right-content.split-screen')
            explanation.then( element => {
              if(element[0].scrollHeight > element[0].clientHeight) {
                cy.get('.question-content.right-content.split-screen').scrollTo('bottom', { ensureScrollable: false }).screenshot(`exam-${row}-${question}-explanation1`, {capture:'fullPage'})
              }
            }
            )
            
          }

          cy.visit('https://www.uworld.com/courseapp/usmle/v14/blocks/8395935')
          

      }
      
    
  })
})