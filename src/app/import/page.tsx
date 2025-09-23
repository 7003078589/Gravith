import Layout from '@/components/Layout';
import ExcelImport from '@/components/ExcelImport';

export default function ImportPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ExcelImport />
      </div>
    </Layout>
  );
}
