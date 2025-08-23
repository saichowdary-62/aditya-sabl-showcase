import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import EntryForm from '@/components/EntryForm';
import GalleryForm from '@/components/GalleryForm';
import { motion } from 'framer-motion';

const AnimatedTabsContent = ({ value, children }: { value: string, children: React.ReactNode }) => (
  <TabsContent value={value} asChild>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </TabsContent>
);


const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="upcoming" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming Activities</TabsTrigger>
          <TabsTrigger value="previous">Previous Activities</TabsTrigger>
          <TabsTrigger value="winners">Winners</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <AnimatedTabsContent value="upcoming">
          <div className="p-4 border rounded-lg mt-4">
            <h2 className="text-2xl font-semibold mb-4">Add Upcoming Activity</h2>
            <EntryForm />
          </div>
        </AnimatedTabsContent>
        <AnimatedTabsContent value="previous">
          <div className="p-4 border rounded-lg mt-4">
            <h2 className="text-2xl font-semibold mb-4">Add Previous Activity</h2>
            <EntryForm />
          </div>
        </AnimatedTabsContent>
        <AnimatedTabsContent value="winners">
          <div className="p-4 border rounded-lg mt-4">
            <h2 className="text-2xl font-semibold mb-4">Add Winner</h2>
            <EntryForm />
          </div>
        </AnimatedTabsContent>
        <AnimatedTabsContent value="gallery">
          <div className="p-4 border rounded-lg mt-4">
            <h2 className="text-2xl font-semibold mb-4">Add to Gallery</h2>
            <GalleryForm />
          </div>
        </AnimatedTabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
