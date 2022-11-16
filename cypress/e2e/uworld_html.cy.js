describe('My = 1  Test', () => {
  it('Visits uworld', () => {
    cy.viewport(2560, 1020)
    cy.visit('https://www.uworld.com/app/index.html#/login/')

    cy.contains('Email').click().type('divyaanilp@gmail.com')
    cy.contains('Password').click().type('WOrePTONeldI')
    cy.get('#login_btn').click()
    cy.get('#BtnLaunch8395936').click()
    cy.contains('Previous Tests').click()
    //cy.get('.ng-tns-c199-164 ng-star-inserted').type('100')
    const totalPages = 16
    const totalRows = 10
    // const totalPages = 2
    // const totalRows = 2
    const pageS = Number(Cypress.env('PAGE_TO_EXECUTE'));
    
    for(let page=pageS;page <=pageS;page++){

      for(let row =1; row<=totalRows;row++){
        for(let paginate=1; paginate < page; paginate++){
          cy.get('.mat-paginator-navigation-next').click()
        }
        
        
        cy.xpath(`//*[@id="cdk-drop-list-0"]/tbody/tr[${row}]/td[8]`).then(($span) => {
          cy.xpath(`//*[@id="cdk-drop-list-0"]/tbody/tr[${row}]/td[9]/p[3]/i`).click()

          // $span is the object that the previous command yielded
       
          const questionCount = $span.text();
          // const questionCount = 2;
       
          cy.get('.review-button').click()
          //cy.contains('Full Screen').click()
          
          cy.get('#questionInformation').invoke('attr', 'style', 'flex-basis: 740px;')
          .should('have.attr', 'style', 'flex-basis: 740px;')

          for(let question=1;question <= Number(questionCount); question++){
            cy.xpath(`//*[@id="leftNavigator"]/div/table/tbody/tr[${question}]/td/span[2]`).click()
            cy.get('html:root').eq(0).invoke('prop', 'innerHTML').then((doc) => {
              cy.writeFile(`/Users/anilpuliyeril/codebase/sources3/html-${page}-${row}-${question}.html`, doc);
            });
            
          }

          cy.visit('https://www.uworld.com/courseapp/usmle/v14/previoustests/8395936')
          
         })
         
      }
      
    }
  })
})
