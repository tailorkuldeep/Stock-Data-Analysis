## Covid Run

def check(n,k,x,y):
    if x==y:
        return 'YES'
    if n==y:
        y=0
    p=x
    while p!=y:
        #print(p)
        p=(p+k)%n
        if p==x:
            return 'NO'
    return 'YES'
        
t = int(input())
for _ in range(t):
    n,k,x,y = map(int,input().split())
    print(check(n,k,x,y))    
