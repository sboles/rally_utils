FIELDS_TO_HIDE = [
"Tags", 
"State", 
"Blocked", 
"Release", 
"Iteration", 
"Plan Est", 
"Task Est", 
"Actual", 
"To Do", 
"Affects User Learning", 
"Anticipated Toggle On Date", 
"Blocked Reason",
"Customer Development Kanban",	
"date",
"Due Date",	 
"External Link",	
"Data Migration",	
"Integrations Kanban",	
"Integrations TAM Votes",		
"IT Effort",	
"IT Value",	
"KanbanState",	
"On-Prem Impact",		
"Onboarding Kanban",	
"Partner Coach Kanban",	
"Partner Coach Vette Kanban",	
"Partner Kanban States",	
"Portfolio Tab",		
"Priority",	
"Product Marketing Kanban",	
"ProvisioningKanbanState",	
"PS Allocation",	
"Requesting Customers",	
"Number of Requests",		 
"Salesforce Feature",	
"Link Label",	
"ID",	
"Recon",	
"Risk",	
"Affected Customers",	
"Number of Cases",		 
"Salesforce Case",	
"Link Label",	
"ID",	
"Salesforce Council Kanban",	
"SalesOps",		
"SalesOps Specific",	
"Stratus Load All Stories",		
"Sustainability Kanban",	
"T-Shirt",	
"Urgent",		
"Watch List",	
"Work Start Date",	 	
"Notes",
"Change Description"]

var rows = document.getElementsByTagName('tr');

for( var field_to_hide in FIELDS_TO_HIDE ) {
  for( var i in rows ){
   var row = rows[i];
   if( row.innerHTML && row.innerHTML.indexOf(field_to_hide) !== -1 ){
     row.style.display = "none";
   } 
  }
}

