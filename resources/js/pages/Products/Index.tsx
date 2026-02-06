import { Head, router, useForm } from '@inertiajs/react';
import { ShoppingCart, Pencil, Trash2} from 'lucide-react';
import { useState, type FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
}

interface IndexProps {
    products: {
        data: Product[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

export default function Index({ products }: IndexProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Track the product being edited

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        price: '',
    });

    // Unified Modal Opener
    const openModal = (product: Product | null = null) => {
        clearErrors();
        setEditingProduct(product); // Set the product (or null if creating)

        if (product) {
            // Edit Mode: Fill form with product data
            setData({
                name: product.name,
                description: product.description,
                price: product.price,
            });
        } else {
            // Create Mode: Reset form
            reset();
        }

        setIsOpen(true);
    };

    //  Smart Submit Handler
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingProduct) {
            // Edit Logic (PUT)
            put(`/products/${editingProduct.id}`, {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    setEditingProduct(null);
                },
            });
        } else {
            // Create Logic (POST)
            post('/products', {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
            });
        }
    };

    const deleteProduct = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/products/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* ... (Placeholder Grid - Same as before) ... */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    {/* ... other placeholders ... */}
                </div>

                <div className="relative min-h-screen flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">

                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-2xl font-bold">Products</h1>

                        <Button onClick={() => openModal(null)} className="gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Add Product
                        </Button>

                        {/* Form: ADD ? Edit */}
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogContent className="sm:max-w-sm">
                                <DialogHeader className="border-b items-center pb-4">
                                    <DialogTitle className="flex items-center gap-2">
                                        {editingProduct ? <Pencil className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </DialogTitle>
                                    <DialogDescription className="text-muted-foreground text-center">
                                        {editingProduct
                                            ? "Make changes to your product here. Click save when done."
                                            : "Enter the product details below. Click save when done."}
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Laptop" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" placeholder="A powerful device" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                        {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" placeholder="0.00" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                        {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={processing} >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-25">Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.data?.length > 0 ? (
                                    products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.description}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell className="text-right flex justify-end gap-2">
                                                {/* Edit Button triggers the SAME modal, but with data */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openModal(product)}
                                                >
                                                    <Pencil className="h-3 w-3 mr-1" /> Edit
                                                </Button>

                                                <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
