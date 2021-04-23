import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const convertIsoDateToLocalizedString = (isoDate: string) => format(parseISO(isoDate), 'd MMM yy', { locale: ptBR });
