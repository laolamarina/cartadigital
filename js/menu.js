/* =========================================================
   BLINK MENÚ — LA OLA MARINA (DEMO)
   Edita aquí WhatsApp, productos, precios e imágenes.
   Doce fotografías ilustrativas están guardadas localmente
   en img/plato-ID.jpg. El resto mantiene sus rutas originales.
   Los dibujos SVG siguen disponibles como respaldo.
   ========================================================= */
window.RESTAURANTE = {
  nombre: 'La Ola Marina',
  lema: 'Una ola de sabor en cada plato.',
  whatsapp: '', // CONFIGURAR: número de WhatsApp de la cevichería, sin +, ej.: 51987654321
  direccion: 'Dirección por configurar',
  sedes: ['Local principal'],
  horario: 'Horario por confirmar',
  moneda: 'S/'
};

const foto = (id, w=900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

window.BANNERS = [
  { kicker: 'CEVICHERÍA LA OLA MARINA', first: 'El mar tiene', accent: 'un sabor', last: 'especial.', text: 'Ceviches frescos, platos que sorprenden y el mejor plan para disfrutar en buena compañía.', cta: 'Explorar la carta', image: foto(31495669,1500), imageAlt:'Ceviche peruano con pescado, maíz y acompañamientos', fallback:'img/plato-c1.svg', tag:'Fresco y delicioso', color:'teal' },
  { kicker: 'LOS FAVORITOS PARA COMPARTIR', first: 'El plan es', accent: 'compartir', last: 'la ola.', text: 'Dúos y tríos marinos que reúnen lo mejor del ceviche, las frituras y la sazón peruana.', cta: 'Ver dúos y tríos', image: 'img/plato-p1.jpg', imageAlt:'Ceviche acompañado de fritura de pescado y mariscos', fallback:'img/plato-p1.svg', tag:'Pide para compartir', color:'coral', anchor:'compartir' },
  { kicker: 'TRADICIÓN QUE ENAMORA', first: 'Mucho', accent: 'sabor', last: 'peruano.', text: 'Desde un lomo saltado jugoso hasta nuestros clásicos con mariscos. Encuentra tu nuevo favorito.', cta: 'Ver platos criollos', image: foto(28503582,1500), imageAlt:'Lomo saltado peruano con papas fritas y arroz', fallback:'img/plato-r1.svg', tag:'Sazón peruana', color:'yellow', anchor:'criollos' }
];

window.CATEGORIAS = [
  { id:'ceviches', nombre:'Ceviches', subtitulo:'La frescura es protagonista', descripcion:'El pique perfecto del limón, el pescado fresco y el toque exacto de ají.', icon:'🐟', color:'menta' },
  { id:'compartir', nombre:'Para compartir', subtitulo:'Dúos y tríos', descripcion:'Cuando un solo antojo no basta, combinamos los favoritos de la mesa.', icon:'🍽️', color:'durazno' },
  { id:'criollos', nombre:'Platos criollos', subtitulo:'Sazón peruana', descripcion:'Contundentes, sabrosos y hechos con ese gusto de siempre.', icon:'🍚', color:'crema' },
  { id:'bebidas', nombre:'Bebidas', subtitulo:'El complemento perfecto', descripcion:'Algo fresco para acompañar cada bocado.', icon:'🥤', color:'celeste' }
];

window.PRODUCTOS = [
  // CEVICHES — 5
  { id:'c1',categoria:'ceviches',nombre:'Ceviche clásico',descripcion:'Pescado fresco, leche de tigre, cebolla roja, camote y choclo.',precio:32,imagen:foto(31495669),tag:'Más pedido', popular:true },
  { id:'c2',categoria:'ceviches',nombre:'Ceviche mixto',descripcion:'Pescado y mariscos frescos al limón, con los acompañamientos de casa.',precio:39,imagen:foto(31495672),tag:'Favorito' },
  { id:'c3',categoria:'ceviches',nombre:'Ceviche carretillero',descripcion:'Ceviche clásico coronado con crocante chicharrón de pescado.',precio:36,imagen:foto(28448389) },
  { id:'c4',categoria:'ceviches',nombre:'Ceviche de mariscos',descripcion:'Selección de mariscos con leche de tigre y ají al gusto.',precio:42,imagen:foto(31495671) },
  { id:'c5',categoria:'ceviches',nombre:'Ceviche apaltado de langostinos',descripcion:'Langostinos al limón, palta fresca, cebolla y toque de ají.',precio:38,imagen:'img/plato-c5.jpg' },
  // COMPARTIR — 4
  { id:'p1',categoria:'compartir',nombre:'Dúo marino',descripcion:'Ceviche clásico + chicharrón de pescado. Ideal para dos antojos.',precio:56,imagen:'img/plato-p1.jpg',tag:'Para dos',popular:true },
  { id:'p2',categoria:'compartir',nombre:'Dúo del puerto',descripcion:'Ceviche mixto + arroz con mariscos. Un encuentro de sabores.',precio:62,imagen:'img/plato-p2.jpg' },
  { id:'p3',categoria:'compartir',nombre:'Trío clásico',descripcion:'Ceviche + chicharrón de pescado + arroz con mariscos.',precio:79,imagen:'img/plato-p3.jpg',tag:'Para compartir' },
  { id:'p4',categoria:'compartir',nombre:'Trío especial',descripcion:'Ceviche mixto + jalea + arroz con mariscos. Para disfrutar en grupo.',precio:89,imagen:'img/plato-p4.jpg' },
  // CRIOLLOS — 5
  { id:'r1',categoria:'criollos',nombre:'Lomo saltado',descripcion:'Lomo jugoso salteado al wok con papas doradas y arroz.',precio:39,imagen:foto(28503582),tag:'Clásico',popular:true },
  { id:'r2',categoria:'criollos',nombre:'Arroz con mariscos',descripcion:'Arroz meloso, mariscos seleccionados y sazón costeña.',precio:44,imagen:'img/plato-r2.jpg' },
  { id:'r3',categoria:'criollos',nombre:'Chaufa de mariscos',descripcion:'Arroz al wok, sillao, cebolla china y una mezcla marina.',precio:38,imagen:'img/plato-r3.jpg' },
  { id:'r4',categoria:'criollos',nombre:'Tacu tacu a lo macho',descripcion:'Tacu tacu dorado bañado en salsa cremosa de mariscos.',precio:46,imagen:'img/plato-r4.jpg' },
  { id:'r5',categoria:'criollos',nombre:'Jalea mixta',descripcion:'Crujientes trozos de pescado y mariscos con salsa criolla.',precio:49,imagen:foto(30766476) },
  // BEBIDAS — 5
  { id:'b1',categoria:'bebidas',nombre:'Chicha morada',descripcion:'Refrescante preparación casera de maíz morado. Vaso grande.',precio:9,imagen:foto(28490837),tag:'Casera' },
  { id:'b2',categoria:'bebidas',nombre:'Limonada frozen',descripcion:'Limón recién exprimido, hielo y el punto justo de dulzor.',precio:10,imagen:'img/plato-b2.jpg' },
  { id:'b3',categoria:'bebidas',nombre:'Maracuyá',descripcion:'Jugo de maracuyá fresco, perfecto para el almuerzo.',precio:10,imagen:'img/plato-b3.jpg' },
  { id:'b4',categoria:'bebidas',nombre:'Agua mineral',descripcion:'Botella personal de agua sin gas.',precio:5,imagen:'img/plato-b4.jpg',emoji:'💧' },
  { id:'b5',categoria:'bebidas',nombre:'Gaseosa',descripcion:'Gaseosa personal fría, sabor según disponibilidad.',precio:6,imagen:'img/plato-b5.jpg',emoji:'🥤' }
];
