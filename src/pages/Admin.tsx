import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Settings, Image, Heart, Calendar, Droplets, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import SiteSettingsTab from "@/components/admin/SiteSettingsTab";
import GalleryTab from "@/components/admin/GalleryTab";
import DonorsTab from "@/components/admin/DonorsTab";
import EventsTab from "@/components/admin/EventsTab";
import BloodDonorsTab from "@/components/admin/BloodDonorsTab";
import ComplaintsTab from "@/components/admin/ComplaintsTab";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="py-10">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1">
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
            <TabsTrigger value="gallery"><Image className="w-4 h-4 mr-1" /> Gallery</TabsTrigger>
            <TabsTrigger value="donations"><Heart className="w-4 h-4 mr-1" /> Donors</TabsTrigger>
            <TabsTrigger value="events"><Calendar className="w-4 h-4 mr-1" /> Events</TabsTrigger>
            <TabsTrigger value="blood"><Droplets className="w-4 h-4 mr-1" /> Blood</TabsTrigger>
            <TabsTrigger value="complaints"><MessageSquare className="w-4 h-4 mr-1" /> Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="settings"><SiteSettingsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="gallery"><GalleryTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="donations"><DonorsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="events"><EventsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="blood"><BloodDonorsTab toast={toast} queryClient={queryClient} /></TabsContent>
          <TabsContent value="complaints"><ComplaintsTab toast={toast} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
