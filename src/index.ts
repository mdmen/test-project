import 'materialize-css/dist/css/materialize.min.css';
import './styles.scss';
import { PersonsTable } from './components/PersonsTable';

const PersonsWidget = new PersonsTable({
  container: 'js-table-widget',
  showCount: 50,
  maxLoad: 1000,
  hasSort: true,
  hasFilter: true,
});

PersonsWidget.init();
