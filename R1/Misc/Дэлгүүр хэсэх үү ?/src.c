#include <stdio.h>
#include <stdlib.h>

#define FLAG_BUFFER 100

int main() {
    char flag[FLAG_BUFFER];
    FILE *fp = NULL;
    int balance = 40;
    int option = 0, count = 0, total = 0;

    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);

    do {
        printf("MR Robot компьютер угсралтын дэлгүүрт тавтай морил.\nТаны хэтэвчинд %d₮. Авах зүйлээ сонгоно уу?:\n", balance);
        puts("1. RAM авах  (10₮)");
        puts("2. CPU авах  (20₮)");
        puts("3. Hard disk авах  (30₮)");
        puts("4. Туг авах (100₮)");
        printf("(Сонголт оо хийнэ үү ? )> ");
        scanf("%d", &option);

        if (option == 1) {
            if (balance < 10) {
                printf("Хэтэвчний үлдэгдэл хүрэлцэхгүй! Танд %d₮ байна\n", balance);
                return 1;
            }
            printf("Хэдийг авах вэ ? ");
            scanf("%d", &count);
	    count = abs(count);
            balance -= count * 10;
            total += count;
            printf("Худалдан авалт хийгдсэн , Танд %dш RAM байна.\n", total);
        } else if (option == 2) {
            if (balance < 20) {
                printf("Хэтэвчний үлдэгдэл хүрэлцэхгүй! Танд %d₮ байна\n", balance);
                return 1;
            }
            printf("Хэдийг авах вэ ? ");
            scanf("%d", &count);
	    count = abs(count);
            balance -= count * 20;
            total += count;
            printf("Худалдан авалт хийгдсэн , Танд %dш CPU байна.\n", total);
        } else if (option == 3) {
            if (balance < 30) {
                printf("Хэтэвчний үлдэгдэл хүрэлцэхгүй! Танд %d₮ байна\n", balance);
                return 1;
            }
            printf("Хэдийг авах вэ ? ");
            scanf("%d", &count);

            balance -= count * 30;
            total += count;

            printf("Худалдан авалт хийгдсэн , Танд %dш Hard disk байна.\n", total);
        }
         else if (option == 4) {
            if (balance < 100) {
                printf("Хэтэвчний үлдэгдэл хүрэлцэхгүй! Танд %d₮ байна.\n", balance);
                return 1;
            }

            fp = fopen("flag.txt", "r");
            if (fp == NULL) {
                puts("Алдаа гарлаа, операторт хандана уу.");
                return 1;
            }

            fgets(flag, FLAG_BUFFER, fp);

            puts("\nГайхалтай... Манайхаар дахин үйлчлүүлээрэй");
            printf("Таны туг: %s\n", flag);
            puts("\nComputer repair with a smile.");
            return 0;
        } else break;
    } while (1);

    puts("Ийм бараа байхгүй. Баяртай");
    return 1;
}
