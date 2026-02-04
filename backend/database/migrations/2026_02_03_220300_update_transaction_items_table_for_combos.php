<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transaction_items', function (Blueprint $table) {
            // Add type column to distinguish between product and combo
            $table->string('type')->default('product')->after('id');
            
            // Add combo_id column for combo items
            $table->foreignId('combo_id')->nullable()->after('product_variant_id')->constrained('combos')->nullOnDelete();
            
            // Make product_id and product_variant_id nullable for combo items
            $table->dropForeign(['product_id']);
            $table->dropForeign(['product_variant_id']);
            
            $table->foreign('product_id')->nullable()->change()->references('id')->on('products')->nullOnDelete();
            $table->foreign('product_variant_id')->nullable()->change()->references('id')->on('product_variants')->nullOnDelete();
            
            // Add name column to store the name of the item (product or combo)
            $table->string('name')->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_items', function (Blueprint $table) {
            // Drop added columns
            $table->dropColumn(['type', 'combo_id', 'name']);
            
            // Make product_id and product_variant_id not nullable again
            $table->dropForeign(['product_id']);
            $table->dropForeign(['product_variant_id']);
            
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('product_variant_id')->references('id')->on('product_variants')->onDelete('cascade');
            
            $table->unsignedBigInteger('product_id')->nullable(false)->change();
            $table->unsignedBigInteger('product_variant_id')->nullable(true)->change();
        });
    }
};