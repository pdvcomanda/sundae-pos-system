import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Download, Upload, Trash2, QrCode, Save, Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/ThemeContext';

// Import our services
import { 
  getBusinessSettings, 
  updateBusinessSettings, 
  getPrinterSettings, 
  updatePrinterSettings,
  createBackup,
  exportData 
} from '@/services/settingsService';
import { getUsers, addUser, updateUser, deleteUser } from '@/services/userService';

// Import types
import { BusinessSettings, PrinterSettings, User } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const SettingsPage = () => {
  const { toast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Business settings state
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [businessSaving, setBusinessSaving] = useState(false);
  
  // Printer settings state
  const [printerSettings, setPrinterSettings] = useState<PrinterSettings | null>(null);
  const [printerLoading, setPrinterLoading] = useState(true);
  const [printerSaving, setPrinterSaving] = useState(false);
  const [printerConnecting, setPrinterConnecting] = useState(false);
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userDialogMode, setUserDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // System state
  const [backupLoading, setBackupLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [whatsappQrVisible, setWhatsappQrVisible] = useState(false);
  
  // WhatsApp state
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [chatbotEnabled, setChatbotEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [chatbotMessage, setChatbotMessage] = useState('');
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);

  // Load business settings
  useEffect(() => {
    const loadBusinessSettings = async () => {
      try {
        const settings = await getBusinessSettings();
        setBusinessSettings(settings);
      } catch (error) {
        console.error('Error loading business settings:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações do estabelecimento',
          variant: 'destructive'
        });
      } finally {
        setBusinessLoading(false);
      }
    };

    loadBusinessSettings();
  }, [toast]);
  
  // Load printer settings
  useEffect(() => {
    const loadPrinterSettings = async () => {
      try {
        const settings = await getPrinterSettings();
        setPrinterSettings(settings);
      } catch (error) {
        console.error('Error loading printer settings:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações da impressora',
          variant: 'destructive'
        });
      } finally {
        setPrinterLoading(false);
      }
    };

    loadPrinterSettings();
  }, [toast]);
  
  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Error loading users:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os usuários',
          variant: 'destructive'
        });
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [toast]);

  // Save business settings
  const handleSaveBusinessSettings = async () => {
    if (!businessSettings) return;
    
    setBusinessSaving(true);
    try {
      const updated = await updateBusinessSettings(businessSettings);
      setBusinessSettings(updated);
      toast({
        title: 'Sucesso',
        description: 'Configurações do estabelecimento salvas com sucesso',
      });
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações do estabelecimento',
        variant: 'destructive'
      });
    } finally {
      setBusinessSaving(false);
    }
  };
  
  // Save printer settings
  const handleSavePrinterSettings = async () => {
    if (!printerSettings) return;
    
    setPrinterSaving(true);
    try {
      const updated = await updatePrinterSettings(printerSettings);
      setPrinterSettings(updated);
      toast({
        title: 'Sucesso',
        description: 'Configurações da impressora salvas com sucesso',
      });
    } catch (error) {
      console.error('Error saving printer settings:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações da impressora',
        variant: 'destructive'
      });
    } finally {
      setPrinterSaving(false);
    }
  };
  
  // Connect printer
  const handleConnectPrinter = async () => {
    setPrinterConnecting(true);
    try {
      // Simulate printer connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the printer status
      if (printerSettings) {
        setPrinterSettings({
          ...printerSettings,
          printerName: 'POS-58 Printer',
        });
      }
      
      toast({
        title: 'Sucesso',
        description: 'Impressora conectada com sucesso',
      });
    } catch (error) {
      console.error('Error connecting printer:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível conectar à impressora',
        variant: 'destructive'
      });
    } finally {
      setPrinterConnecting(false);
    }
  };
  
  // Create a backup
  const handleCreateBackup = async () => {
    setBackupLoading(true);
    try {
      await createBackup();
      toast({
        title: 'Sucesso',
        description: 'Backup criado com sucesso',
      });
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o backup',
        variant: 'destructive'
      });
    } finally {
      setBackupLoading(false);
    }
  };
  
  // Export data
  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const blob = await exportData();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `acai-system-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast({
        title: 'Sucesso',
        description: 'Dados exportados com sucesso',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível exportar os dados',
        variant: 'destructive'
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  // Import data
  const handleImportData = () => {
    setImportLoading(true);
    
    // Create a file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        setImportLoading(false);
        return;
      }
      
      try {
        // In a real implementation, you would parse the file and restore the data
        // For now, we'll just show a success message
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: 'Sucesso',
          description: 'Dados importados com sucesso',
        });
      } catch (error) {
        console.error('Error importing data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível importar os dados',
          variant: 'destructive'
        });
      } finally {
        setImportLoading(false);
      }
    };
    
    input.click();
  };
  
  // Save WhatsApp settings
  const handleSaveWhatsAppSettings = async () => {
    setSavingWhatsapp(true);
    try {
      // In a real implementation, you would save this to the database
      // through the systemSettings update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Sucesso',
        description: 'Configurações do WhatsApp salvas com sucesso',
      });
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações do WhatsApp',
        variant: 'destructive'
      });
    } finally {
      setSavingWhatsapp(false);
    }
  };

  // Show QR Code for WhatsApp Web
  const handleShowWhatsAppQR = () => {
    setWhatsappQrVisible(!whatsappQrVisible);
  };
  
  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        toast({
          title: 'Usuário Removido',
          description: `${userToDelete.fullName} foi removido com sucesso.`
        });
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o usuário',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // User form schema
  const userFormSchema = z.object({
    username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
    fullName: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
    role: z.enum(['admin', 'operator']),
    active: z.boolean().default(true)
  });

  // User form
  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: '',
      fullName: '',
      role: 'operator',
      active: true
    }
  });

  // Open add user dialog
  const handleOpenAddUserDialog = () => {
    userForm.reset({
      username: '',
      fullName: '',
      role: 'operator',
      active: true
    });
    setUserDialogMode('add');
  };

  // Open edit user dialog
  const handleOpenEditUserDialog = (user: User) => {
    userForm.reset({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      active: user.active
    });
    setSelectedUser(user);
    setUserDialogMode('edit');
  };

  // Submit user form
  const onUserFormSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      if (userDialogMode === 'add') {
        // Ensure all required fields have values
        const userToAdd: Omit<User, 'id'> = {
          username: values.username,
          fullName: values.fullName,
          role: values.role,
          active: values.active
        };
        
        const newUser = await addUser(userToAdd);
        if (newUser) {
          setUsers([...users, newUser]);
          toast({
            title: 'Usuário Adicionado',
            description: `${newUser.fullName} foi adicionado com sucesso.`
          });
        }
      } else {
        if (!selectedUser) return;
        
        // Ensure all required fields have values
        const userToUpdate: User = {
          id: selectedUser.id,
          username: values.username,
          fullName: values.fullName,
          role: values.role,
          active: values.active
        };
        
        const updatedUser = await updateUser(userToUpdate);
        
        if (updatedUser) {
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          toast({
            title: 'Usuário Atualizado',
            description: `${updatedUser.fullName} foi atualizado com sucesso.`
          });
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o usuário',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="printer">Impressora</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Estabelecimento</CardTitle>
              <CardDescription>
                Configurações gerais do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Nome do Estabelecimento</Label>
                    <Input 
                      id="business-name" 
                      placeholder="Ex: Açaí dos Sonhos" 
                      value={businessSettings?.businessName || ''} 
                      onChange={(e) => setBusinessSettings(prev => prev ? {...prev, businessName: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input 
                      id="address" 
                      placeholder="Endereço do estabelecimento" 
                      value={businessSettings?.address || ''} 
                      onChange={(e) => setBusinessSettings(prev => prev ? {...prev, address: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="Telefone de contato" 
                      value={businessSettings?.phone || ''} 
                      onChange={(e) => setBusinessSettings(prev => prev ? {...prev, phone: e.target.value} : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      placeholder="Email de contato" 
                      type="email" 
                      value={businessSettings?.email || ''} 
                      onChange={(e) => setBusinessSettings(prev => prev ? {...prev, email: e.target.value} : null)}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                disabled={businessLoading || businessSaving} 
                onClick={handleSaveBusinessSettings}
              >
                {businessSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Printer Settings Tab */}
        <TabsContent value="printer" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Impressora</CardTitle>
              <CardDescription>
                Configure as impressoras para cupons e comandas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {printerLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Impressora Principal</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`border rounded-md p-4 flex items-center gap-3 cursor-pointer ${printerSettings?.connectionType === 'bluetooth' ? 'bg-primary/10' : ''}`}
                        onClick={() => setPrinterSettings(prev => prev ? {...prev, connectionType: 'bluetooth'} : null)}
                      >
                        <div className={`h-4 w-4 rounded-full ${printerSettings?.connectionType === 'bluetooth' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                        <span>Bluetooth</span>
                      </div>
                      <div 
                        className={`border rounded-md p-4 flex items-center gap-3 cursor-pointer ${printerSettings?.connectionType === 'usb' ? 'bg-primary/10' : ''}`}
                        onClick={() => setPrinterSettings(prev => prev ? {...prev, connectionType: 'usb'} : null)}
                      >
                        <div className={`h-4 w-4 rounded-full ${printerSettings?.connectionType === 'usb' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                        <span>USB</span>
                      </div>
                    </div>
                  </div>
                  
                  {printerSettings?.connectionType === 'usb' && (
                    <div className="space-y-2 border rounded-md p-4">
                      <h3 className="font-medium">Instalação de Driver USB</h3>
                      <p className="text-sm text-muted-foreground mb-4">Para usar impressoras USB, é necessário instalar os drivers apropriados.</p>
                      <div className="flex gap-2">
                        <Button variant="outline">Baixar Driver Windows</Button>
                        <Button variant="outline">Baixar Driver Mac</Button>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">WebUSB (Navegadores modernos)</h4>
                        <Button>Conectar via WebUSB</Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="printer-name">Dispositivo</Label>
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{printerSettings?.printerName || 'Nenhuma impressora conectada'}</p>
                          <p className="text-xs text-muted-foreground">
                            {printerSettings?.printerName 
                              ? `Conectada via ${printerSettings.connectionType === 'bluetooth' ? 'Bluetooth' : 'USB'}` 
                              : 'Clique em conectar para buscar impressoras disponíveis'}
                          </p>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={handleConnectPrinter}
                          disabled={printerConnecting}
                        >
                          {printerConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Conectar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Imprimir automaticamente</Label>
                      <p className="text-sm text-muted-foreground">Imprimir cupom ao finalizar pedido</p>
                    </div>
                    <Switch 
                      checked={printerSettings?.autoPrint || false}
                      onCheckedChange={(checked) => setPrinterSettings(prev => prev ? {...prev, autoPrint: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Imprimir cupom para cliente</Label>
                      <p className="text-sm text-muted-foreground">Imprimir cupom para o cliente</p>
                    </div>
                    <Switch 
                      checked={printerSettings?.printCustomerReceipt || false}
                      onCheckedChange={(checked) => setPrinterSettings(prev => prev ? {...prev, printCustomerReceipt: checked} : null)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Imprimir cupom para cozinha</Label>
                      <p className="text-sm text-muted-foreground">Imprimir cupom para a cozinha</p>
                    </div>
                    <Switch 
                      checked={printerSettings?.printKitchenReceipt || false}
                      onCheckedChange={(checked) => setPrinterSettings(prev => prev ? {...prev, printKitchenReceipt: checked} : null)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                disabled={printerLoading || printerSaving} 
                onClick={handleSavePrinterSettings}
              >
                {printerSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Controle de acesso ao sistema
                </CardDescription>
              </div>
              <Dialog onOpenChange={() => handleOpenAddUserDialog()}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{userDialogMode === 'add' ? 'Adicionar Usuário' : 'Editar Usuário'}</DialogTitle>
                    <DialogDescription>
                      {userDialogMode === 'add' 
                        ? 'Adicione um novo usuário ao sistema.' 
                        : 'Edite as informações do usuário.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onUserFormSubmit)} className="space-y-4">
                      <FormField
                        control={userForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome de Usuário</FormLabel>
                            <FormControl>
                              <Input placeholder="usuario123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="João da Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Função</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a função" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="operator">Operador</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Usuário Ativo</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Habilitar acesso ao sistema
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Salvar</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.fullName}</p>
                          {!user.active && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">Inativo</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.role === 'admin' ? 'Administrador' : 'Operador'} • {user.username}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog onOpenChange={() => handleOpenEditUserDialog(user)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Editar</Button>
                          </DialogTrigger>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setUserToDelete(user);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum usuário encontrado
                    </div>
                  )}
                </div>
              )}
              
              {/* Delete user dialog */}
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remover Usuário</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja remover o usuário {userToDelete?.fullName}? Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDeleteUser}>Remover</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Tab */}
        <TabsContent value="system" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sistema</CardTitle>
              <CardDescription>
                Configurações do sistema e backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro</p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">WhatsApp Integration</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Integração com WhatsApp</Label>
                      <p className="text-sm text-muted-foreground">Conectar com WhatsApp para receber pedidos</p>
                    </div>
                    <Switch 
                      checked={whatsappEnabled}
                      onCheckedChange={setWhatsappEnabled}
                    />
                  </div>
                  
                  {whatsappEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                        <Input 
                          id="whatsapp-number" 
                          placeholder="+55 (00) 00000-0000" 
                          value={whatsappNumber} 
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Chatbot Automático</Label>
                          <p className="text-sm text-muted-foreground">Responder automaticamente mensagens</p>
                        </div>
                        <Switch 
                          checked={chatbotEnabled} 
                          onCheckedChange={setChatbotEnabled} 
                        />
                      </div>
                      
                      {chatbotEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="chatbot-message">Mensagem de Boas-Vindas</Label>
                          <Textarea 
                            id="chatbot-message" 
                            placeholder="Olá! Bem-vindo ao Açaí dos Sonhos. Como posso ajudar?" 
                            value={chatbotMessage} 
                            onChange={(e) => setChatbotMessage(e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Button 
                          onClick={handleShowWhatsAppQR}
                          variant="outline"
                          className="flex gap-2"
                        >
                          <QrCode className="h-4 w-4" />
                          {whatsappQrVisible ? 'Esconder QR Code' : 'Mostrar QR Code'}
                        </Button>
                        
                        {whatsappQrVisible && (
                          <div className="mt-4 border rounded-md p-4 flex flex-col items-center">
                            <p className="text-sm text-muted-foreground mb-4">Escaneie o QR Code abaixo para conectar o WhatsApp Web:</p>
                            <div className="bg-white p-4 rounded">
                              <img 
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/whatsapp-connect" 
                                alt="WhatsApp QR Code" 
                                className="h-40 w-40" 
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Este QR Code expirará em 45 segundos</p>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={handleSaveWhatsAppSettings}
                        disabled={savingWhatsapp}
                      >
                        {savingWhatsapp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Configurações WhatsApp
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Backup de Dados</p>
                <p className="text-sm text-muted-foreground mb-4">Faça backup dos dados do sistema</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={handleCreateBackup}
                    disabled={backupLoading}
                  >
                    {backupLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Criar Backup
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={handleExportData}
                    disabled={exportLoading}
                  >
                    {exportLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Exportar Dados
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex gap-2"
                    onClick={handleImportData}
                    disabled={importLoading}
                  >
                    {importLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Importar Dados
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Versão do Sistema</p>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
                <p className="text-sm text-muted-foreground mt-2">Última atualização: 20/05/2025</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
