import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function FormatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const formattedDate = format(date, 'EEEE d \'de\' MMMM \'de\' yyyy', { locale: es });

  const formattedDateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return formattedDateCapitalized;
}
