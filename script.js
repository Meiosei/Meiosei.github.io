import { logo } from './logo.js';

async function generatePDF(event) {

  alert("Realizando Download do seu chamado...");

  class Info {
    constructor(key, value, rotulo) {
      this.key = key;
      this.value = value;
      this.rotulo = rotulo;
    }

    xy(x, y) {
      doc.setFont("helvetica", "normal").text(this.rotulo + ": " + this.value, x, y);
      console.log("deu bom");
    }
  }

  event.preventDefault();

  const form = document.getElementById('form');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  console.log(data);

  data.typeService = form.querySelector('input[name="typeService"]:checked')?.value || 'N/A';
  data.modelPrint = form.querySelector('input[name="modelPrint"]:checked')?.value || 'N/A';
  data.status = form.querySelector('input[name="status"]:checked')?.value || 'N/A';

  const serviceDescriptions = form.querySelectorAll('input[name="serviceDescription"]:checked');
  data.serviceDescription = Array.from(serviceDescriptions).map(cb => cb.value).join(', ');

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  const ex = 10;
  const ey = 40;
  const w = 190;
  const h = 275;
  const esp1 = h * 0.15;
  const esp2 = h * 0.10;
  const esp3 = h * 0.30;
  const slot1 = esp1;
  const slot2 = esp1 + esp2;
  const slot3 = esp1 + esp2 + esp3;

  console.log(slot1, esp1);

  const marcaDagua = () => {
    doc.setFontSize(12);
    doc.setFillColor(255, 255, 0).rect(w * 0.30 - 5, 15, 113, 20, 'DF');
    doc.text('LOCAÇÃO DE IMPRESSORAS E COPIADORAS,', w * 0.40 - 15, 21);
    doc.text('SUPORTE TÉCNICO,', w * 0.55 - 15, 26);
    doc.text('E SERVIÇOS DE GRÁFICA RÁPIDA.', w * 0.48 - 15, 31);
    doc.addImage(logo, 'PNG', 12, 10, 35, 30);
  };

  const contatos = () => {
    doc.text('Contato: (85) 9.8652.5594 / (85) 9.8758-3721', w * 0.45 - 22, h - 5);
    doc.text(' E-mail: souzakrscopiadoras@outlook.com', w * 0.45 - 21, h);
  };

  const bordaExterna = () => doc.rect(10, 10, w, h);
  const cabecalho = () => doc.rect(ex, ey, w, esp1);
  const infoCli = () => doc.rect(ex, ey + slot1, w, esp2);
  const infoEquip = () => doc.rect(ex, ey + esp1 + esp2, w, esp3);

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();

  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  marcaDagua();
  bordaExterna();
  contatos();

  doc.setFillColor(0, 255, 0);
  doc.setDrawColor(0, 0, 0);
  cabecalho();
  infoCli();
  infoEquip();

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const rotulos = {
    cliente: 'Cliente',
    endereço: 'Endereço',
    bairro: 'Bairro',
    fone: 'Telefone',
    sala: 'Sala',
    email: 'Email',
    n: 'N°',
    andar: 'Andar',
    whatsapp: 'WhatsApp',
    typeService: 'Serviço',
    modelPrint: 'Fabricante',
    status: 'Status',
    modelo: 'Modelo',
    nSerie: 'N° Série',
    serviceDescription: 'Descrição do Serviço',
    description: "Comentário",
    horaIn: "Horário Inicial",
    horaFin: "Horário Final",
    valor: "Valor à Receber",
    data: "Data",
    contScan: "Contadores Scan",
    contImp: "Contadores Impressão",
    clienteAssin: "Cliente",
    tecAssin: "Técnico"
  };

  const inf = {};
  for (const [key, value] of Object.entries(data)) {
    const rotulo = rotulos[key] || key;
    inf[key] = new Info(key, value, rotulo);
  }

  const marginx = 2 + ex;
  const marginy = 5 + ey;
  const pady = 5;
  const padx = 70;

  doc.setFont("helvetica", "bold").text('Informações do Cliente', marginx, marginy);

  inf.cliente.xy(marginx, marginy + pady);
  inf.endereço.xy(marginx, marginy + pady * 2);
  inf.bairro.xy(marginx, marginy + pady * 3);
  inf.fone.xy(marginx, marginy + pady * 4);

  inf.sala.xy(marginx + padx, marginy + pady * 3);
  inf.email.xy(marginx, marginy + pady * 5);

  inf.n.xy(marginx + 1.75 * padx, marginy + pady * 2);
  inf.andar.xy(marginx + 1.75 * padx, marginy + pady * 3);
  inf.whatsapp.xy(marginx + padx, marginy + pady * 4);

  doc.setFont("helvetica", "bold").text('Informações do Equipamento', marginx, marginy + slot1);
  inf.typeService.xy(marginx, marginy + slot1 + pady);
  inf.modelPrint.xy(marginx, marginy + slot1 + pady * 2);
  inf.modelo.xy(marginx + padx, marginy + slot1 + pady * 2);

  inf.status.xy(marginx, marginy + slot1 + pady * 3);
  inf.nSerie.xy(marginx + 1.75 * padx, marginy + slot1 + pady * 2);

  doc.setFont("helvetica", "bold").text('Detalhes do Serviço', marginx, marginy + slot2);
  inf.serviceDescription.xy(marginx, marginy + slot2 + pady * 2);
  inf.description.xy(marginx, marginy + slot2 + pady * 4);

  inf.horaIn.xy(marginx, marginy + slot2 + pady * 8);
  inf.horaFin.xy(marginx, marginy + slot2 + pady * 9);

  inf.valor.xy(marginx + padx, marginy + slot2 + pady * 8);
  inf.data.xy(marginx + padx, marginy + slot2 + pady * 9);

  inf.contScan.xy(marginx, marginy + slot2 + pady * 11);
  inf.contImp.xy(marginx, marginy + slot2 + pady * 12);

  doc.setFont("helvetica", "bold").text('Assinaturas', marginx, marginy + slot3);
  inf.clienteAssin.xy(marginx, h - 50);
  inf.tecAssin.xy(marginx + padx + 30, h - 50);

  doc.setFont("helvetica", "bold").text(`Fortaleza/CE, ${day} de ${month} de ${year} `, marginx + w * 0.30, h - 20);
  console.log(data.contScan);

  doc.save(`Chamado_Técnico_${inf.cliente.value}.pdf`);
}

document.getElementById('submit').addEventListener('click', generatePDF);