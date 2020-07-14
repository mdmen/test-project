import 'materialize-css/dist/css/materialize.min.css';
import './styles.scss';
import { PersonsTable } from './components/PersonsTable';

const PersonsWidget = new PersonsTable({
  container: 'js-table-widget',
  showCount: 15,
  maxLoad: 200,
  hasSort: true,
  hasFilter: true,
});

PersonsWidget.init();
