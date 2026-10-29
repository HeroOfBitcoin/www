import type { Language } from './locales';

interface OrderReferenceTranslation {
  copy: string;
  copied: string;
  manualCopy: string;
}

export const orderReferenceTranslations = {
  en: { copy: 'Copy order reference', copied: 'Order reference copied.', manualCopy: 'Reference selected. Use your device’s copy command.' },
  de: { copy: 'Bestellreferenz kopieren', copied: 'Bestellreferenz kopiert.', manualCopy: 'Referenz markiert. Nutze die Kopierfunktion deines Geräts.' },
  es: { copy: 'Copiar referencia del pedido', copied: 'Referencia del pedido copiada.', manualCopy: 'Referencia seleccionada. Usa la función de copiar de tu dispositivo.' },
  it: { copy: 'Copia riferimento ordine', copied: 'Riferimento ordine copiato.', manualCopy: 'Riferimento selezionato. Usa la funzione di copia del dispositivo.' },
  ja: { copy: '注文番号をコピー', copied: '注文番号をコピーしました。', manualCopy: '注文番号を選択しました。端末のコピー機能を使ってください。' },
  ko: { copy: '주문 번호 복사', copied: '주문 번호를 복사했습니다.', manualCopy: '주문 번호가 선택되었습니다. 기기의 복사 기능을 사용하세요.' },
  fr: { copy: 'Copier la référence de commande', copied: 'Référence de commande copiée.', manualCopy: 'Référence sélectionnée. Utilisez la fonction de copie de votre appareil.' },
  nl: { copy: 'Bestelreferentie kopiëren', copied: 'Bestelreferentie gekopieerd.', manualCopy: 'Referentie geselecteerd. Gebruik de kopieerfunctie van je apparaat.' },
  fi: { copy: 'Kopioi tilausnumero', copied: 'Tilausnumero kopioitu.', manualCopy: 'Tilausnumero valittu. Käytä laitteesi kopiointitoimintoa.' },
} satisfies Record<Language, OrderReferenceTranslation>;
