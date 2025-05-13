import { Outlet }        from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme }         from '../../ui/adminTheme';
import { GlobalStyle }   from '../../ui/adminGlobalStyle';
import PageLayout        from '../../components/admin/PageLayout';

export default function AdminDashboard(){
  return(
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
      <PageLayout>
        <Outlet/>
      </PageLayout>
    </ThemeProvider>
  );
}
