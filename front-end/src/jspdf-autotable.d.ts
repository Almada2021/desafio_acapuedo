declare module "jspdf-autotable" {
  interface jsPDF {
    autoTable: (options: unknown) => jsPDF;
  }
}
