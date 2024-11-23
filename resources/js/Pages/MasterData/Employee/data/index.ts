export const columns = [
    { id: "employee_id", label: "Employee ID", width: "20%", sorting: true },
    { id: "name", label: "Name", width: "20%", sorting: true },
    { id: "email", label: "Email", width: "10%", sorting: true },
    { id: "phone", label: "Phone", width: "20%", sorting: false },
    { id: "role", label: "Role", width: "10%", sorting: true },
    { id: "department", label: "Department", width: "10%", sorting: true },
    { id: "status", label: "Status", width: "10%", sorting: true },
    { id: "Action" },
];

export const example_excel_header_formats = [
    "Name",
    "Email",
    "Phone",
    "Department ID",
    "Role",
];
export const example_excel_formats = [
    {
        name: "Aung Kaung Moe",
        email: "moea74759@gmail.com",
        phone: "",
        department_id: "CID-129c6f",
        role: "dept_admin",
    },
    {
        name: "Ben Ne Dette",
        email: "",
        phone: "09123456789",
        department_id: "CTO-8f46c8",
        role: "employee",
    },
    {
        name: "Ronaldo Jr7",
        email: "ronaldo@gmail.com",
        phone: "09123456789",
        department_id: "CTO-8f46c8",
        role: "employee",
    },
];

export const notes = [
    "1. Don't need to include header value. (eg. Name, Email, Phone, etc...).",
    "2. User can have both phone and email or can have one of those.",
    "3. Department id will be department's code.",
    "4. Role can be dept_admin or employee.",
];
