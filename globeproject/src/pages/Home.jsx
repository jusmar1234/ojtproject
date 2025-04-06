import React, { useState } from 'react';
import { Card, Button, Dialog } from '@/components/ui';
import FileUpload from '@/components/FileUpload';
import DataTable from '@/components/DataTable';
import Charts from '@/components/Charts';
import Suggestions from '@/components/Suggestions';

const Home = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDataParsed = (cleanedData) => {
    setData(cleanedData);
    setIsModalOpen(true); // Open modal when data is uploaded
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">📊 Survey / Task Dashboard</h1>
      <Card className="p-4 shadow-lg border rounded-lg">
        <FileUpload onDataParsed={handleDataParsed} />
      </Card>

      {data.length > 0 ? (
        <>
          <Card className="p-4 shadow-lg border rounded-lg">
            <Charts data={data} />
          </Card>

          <Card className="p-4 shadow-lg border rounded-lg">
            <Suggestions data={data} />
          </Card>
        </>
      ) : (
        <p className="text-gray-500">No data uploaded yet.</p>
      )}

      {/* Modal for showing the data table */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Uploaded Data</h2>
        <DataTable data={data} />
        <Button className="mt-4" onClick={() => setIsModalOpen(false)}>
          Close
        </Button>
      </Dialog>
    </div>
  );
};

export default Home;
