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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('invoice_number')->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('service_charge_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('final_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2);
            $table->decimal('change_amount', 10, 2);
            $table->enum('payment_method', ['cash', 'card', 'transfer', 'ewallet', 'qris', 'other']);
            $table->string('payment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'completed', 'voided', 'refunded'])->default('completed');
            $table->boolean('is_void')->default(false);
            $table->boolean('is_refund')->default(false);
            $table->text('void_reason')->nullable();
            $table->text('refund_reason')->nullable();
            $table->boolean('is_synced')->default(true);
            $table->foreignId('cashier_id')->constrained('users');
            $table->foreignId('customer_id')->nullable()->constrained('customers');
            $table->foreignId('outlet_id')->nullable()->constrained('outlets');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};